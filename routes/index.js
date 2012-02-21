var dns = require("../dns")
  , details = require("./details");

/*
 * GET home page.
 */
var i = 0;
exports.index = function(req, res){
  var rsdns = new dns();
  rsdns.initialize(req.session.dns_name, req.session.dns_key, function(err, data) {
    if (err) throw err;
    var result = JSON.parse(data);
    req.session.dns_auth_token = result.auth_token;
    req.session.dns_acct_num = result.acct_num;
    rsdns.getDomains( function(data) {
      console.log(data[0].toJSON());
      res.render('index.html');
    });
  });
};

exports.details = details;
