var dns = require("../dns");

/*
 * GET domains page.
 */
exports.get = function(req, res){
  var rsdns = new dns();
  rsdns.initialize(req.session.dns_name, req.session.dns_key, function(err, data) {
    if (err) throw err;
    var result = JSON.parse(data);
    req.session.dns_auth_token = result.auth_token;
    req.session.dns_acct_num = result.acct_num;
    rsdns.getDomains( function(data) {
      var domains = JSON.parse(data);
      //console.log(domains.domains);
      res.render('domains', { domains : domains.domains });
    });
  });
};
