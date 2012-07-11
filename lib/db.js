var mysql = require("mysql"), Step = require("step"), config = require('./config'), crypto = require('crypto');

var connection;
var link;

var DB = module.exports = function() {
	connection = mysql.createConnection({ 
		"host" : config.db_hostname,
		"user" : config.db_user,
		"password" : config.db_password,
		"database" : config.db_database
	});
	connection.connect(function(err) {
		// connected! (unless `err` is set)
		if (err) throw err;
		console.log('connected');
	});
	connection.on('close', function(err) {
		if (err) {
			// We did not expect this connection to terminate
			connection = mysql.createConnection(connection.config);
		} else {
			// We expected this to happen, end() was called.
			console.log('closing the db connection');
		}
	});
};

// get key
DB.prototype.getKey = Step.fn(function(uname, passwd) {
	var hash = crypto.createHmac("sha512", config.passwd_salt).update(passwd).digest("hex");
	var query = connection.query('select id, rs_username, rs_key from users where name = ? and passwd = ?', [uname, hash],  this);
}, function  parseResults(err, rows) {
	if (err) throw err;
	var returnStr = '';
	var result = rows[0];
	returnStr = '{ "results" : [ {';
	returnStr += '"name" : "' + result.rs_username + '", "key" : "' + result.rs_key + '" }, ';
	returnStr = returnStr.substring(0, returnStr.length - 2);
	returnStr += ' ] }';
	return returnStr;
});

// create account
DB.prototype.addUser = Step.fn(function(username, key, pass, email_addr, rax_username) {
	var hash = crypto.createHmac("sha512", config.passwd_salt).update(pass).digest("hex");
	var vals = {name: username, rs_key: key, seq_num: 1, last_updt: new Date(), passwd: hash, email: email_addr, rs_username: rax_username};
	var query = connection.query('insert into users set ?', vals, this);
}, function parseResult(err, result) {
	if (err) throw err;
	else
		return 'success';
});

// validate email
DB.prototype.validateEmail = Step.fn(function(email) {
	var query = connection.query('select id, name from users where email = ?', [email], this);
}, function parseResult(err, result) {
	if (err) throw err;
	else if (result.length > 0) {
		return result[0].id;
	} else
		return false;
});

// generate unique URI for password reset
DB.prototype.genResetURI = Step.fn(function(id) {
	var pass = '' + id + new Date().getTime();
	var hash = crypto.createHmac("sha1", config.passwd_salt).update(pass).digest("hex");
	link = 'http://link.com/' + hash;
	var vals = {user_id: id, date_requested: new Date(), token: hash};
	var query = connection.query('insert into user_password_reset set ?', vals, this);
}, function parseResult(err, result) {
	if (err) throw err;
	else
		return link;
});

/*
var rsdb = new DB();
var name = crypto.createHmac("md5", config.passwd_salt).update(new Date().toString()).digest("hex");
rsdb.addUser(name, name, name, name, name, function(err, data){console.log(data);});
rsdb.getKey(name, name, function(err, data){console.log(data);});
rsdb.validateEmail(name, function(err, data){console.log(data);});
rsdb.genResetURI(5, function(err, data){console.log(data);});
*/
