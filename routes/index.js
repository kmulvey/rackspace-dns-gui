var dns = require("../dns")
  , domains = require("./domains")
  , details = require("./details");

/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index');
};

exports.domains = domains;
exports.details = details;
