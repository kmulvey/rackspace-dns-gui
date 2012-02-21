var mysql = require("db-mysql"),
    Step = require("./step")

var mydb;

var db = module.exports = function () {
	mydb = new mysql.Database({
                "hostname": "localhost",
                "user": "root",
                "password": "keepouthax0rz",
                "database": "rsdns"
               });
	mydb.on('ready', function () {
		console.log("Database ready");
	});
	mydb.on('error', function (err) {
    		console.log("Database error: " + err);
	});
	mydb.connect();
};

db.prototype.getKey = Step.fn (
	function (name) {
		mydb.query()
                    .select(["id", "name", "rs_key"])
                    .from("users")
                    .where("name = ?", [ name ])
                    .execute(this);
	},
	function parseResult(error, rows, columns){
        	if (error) {
                	console.log('ERROR: ' + error);
                	return;
                }
                returnStr = '{ "results" : [ {';
                for ( var i = 0; i < rows.length; i++ ) {
                	var result = rows[0];
                        returnStr += '"name" : "' + result.name + '", "key" : "' + result.rs_key + '" }, ';
                }
                returnStr = returnStr.substring(0, returnStr.length - 2);
                returnStr += ' ] }';
                return returnStr;
       	}
);	
