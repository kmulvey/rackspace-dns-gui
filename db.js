var mysql = require("db-mysql"), Step = require("step"), config = require('./config'), crypto = require('crypto');

var mydb;

var db = module.exports = function() {
	mydb = new mysql.Database({
		"hostname" : config.db_hostname,
		"user" : config.db_user,
		"password" : config.db_password,
		"database" : config.db_database
	});
	mydb.on('ready', function() {
		console.log("Database ready");
	});
	mydb.on('error', function(err) {
		console.log("Database error: " + err);
	});
	mydb.connect();
};

// get key
db.prototype.getKey = Step.fn(function(name, passwd) {
	var hash = crypto.createHmac("sha512", config.passwd_salt).update(passwd).digest("hex");
	mydb.query().select([ "id", "rs_username", "rs_key" ]).from("users").where("name = ?", [ name ]).and("passwd = ?", [ hash ]).execute(this);
}, function parseResult(error, rows, columns) {
	if (error) {
		console.log('ERROR: ' + error);
		return;
	}
	returnStr = '{ "results" : [ {';
	for ( var i = 0; i < rows.length; i++) {
		var result = rows[0];
		returnStr += '"name" : "' + result.rs_username + '", "key" : "' + result.rs_key + '" }, ';
	}
	returnStr = returnStr.substring(0, returnStr.length - 2);
	returnStr += ' ] }';
	return returnStr;
});

// create account
db.prototype.addUser = Step.fn(function(username, key, pass, email, rs_username) {
	var hash = crypto.createHmac("sha512", config.passwd_salt).update(pass).digest("hex");
	mydb.query().insert('users', [ 'name', 'rs_key', 'seq_num', 'last_updt', 'passwd', 'email', 'rs_username' ], [ escape(username), escape(key), 1, new Date(), hash, escape(email), escape(rs_username) ]).execute(this);
}, function parseResult(error, result) {
	if (error) {
		console.log('DB ERROR: ' + error);
		return error;
	}
	return 'success';
});

// validate email
db.prototype.validateEmail = Step.fn(function(email) {
	mydb.query().select([ "id", "name" ]).from("users").where("email = ?", [ email ]).execute(this);
}, function parseResult(error, rows, result) {
	if (error) {
		console.log('validateEmail DB ERROR: ' + error);
		return error;
	}
	else if (rows.length > 0) {
		return rows[0].id;
	}
	else return false;
});


// generate unique URI for password reset
db.prototype.genResetURI = Step.fn(function(id) {
	var hash = crypto.createHmac("sha1", config.passwd_salt).update(id + new Date().getTime()).digest("hex");
	mydb.query().insert('user_password_reset', [ 'user_id', 'date_requested', 'token'], [ id,new Date(), hash]).execute(this);
}, function parseResult(error, result) {
	if (error) {
		console.log('genResetURI DB ERROR: ' + error);
		return error;
	}
	return 'success';
});
