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
db.prototype.getKey = Step.fn(function(name) {
	mydb.query().select([ "id", "name", "rs_key" ]).from("users").where("name = ?", [ name ]).execute(this);
}, function parseResult(error, rows, columns) {
	if (error) {
		console.log('ERROR: ' + error);
		return;
	}
	returnStr = '{ "results" : [ {';
	for ( var i = 0; i < rows.length; i++) {
		var result = rows[0];
		returnStr += '"name" : "' + result.name + '", "key" : "' + result.rs_key + '" }, ';
	}
	returnStr = returnStr.substring(0, returnStr.length - 2);
	returnStr += ' ] }';
	return returnStr;
});

// create account
db.prototype.addUser = Step.fn(function(username, key, pass, email, rs_username) {
	var hash = crypto.createHmac("sha512", config.passwd_salt).update(pass).digest("hex");
	mydb.query().insert(
			'users', 
			[ 'name', 'rs_key', 'seq_num', 'last_updt', 'passwd', 'email', 'rs_username' ], 
			[ escape(username), escape(key), 1, new Date(), hash, escape(email), escape(rs_username) ]).execute(this);
	},function parseResult(error, result) {
			if (error) {
				console.log('DB ERROR: ' + error);
				return error;
			}
			return 'success';
});