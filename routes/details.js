var dns = require("../dns");
/*
 * GET detail page.
 */

var details = module.exports = function(req, res){
  var rsdns = new dns();
  rsdns.auth_token = req.session.dns_auth_token;
  rsdns.acct_num = req.session.dns_acct_num;
  rsdns.getDomains(function(data) {
    console.log(data[0].toJSON());
    res.render('details.html', { title: data[0].toJSON() });
  });
};
