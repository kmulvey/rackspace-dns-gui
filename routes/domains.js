var dns = require("../dns");

/*
 * GET domains page.
 */

var i = 0;
var domains = module.exports = function(req, res){
  console.log('here');
  var rsdns = new dns();
  rsdns.initialize(req.session.dns_name, req.session.dns_key, function(err, data) {
    if (err) throw err;
    var result = JSON.parse(data);
    req.session.dns_auth_token = result.auth_token;
    req.session.dns_acct_num = result.acct_num;
    rsdns.getDomains( function(data) {
      console.log(data);
      res.render('domains', { domains : data });
    });
  });
};
