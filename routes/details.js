var dns = require("../dns");

/*
 * GET detail page.
 */
var details = module.exports = function(req, res){
  var rsdns = new dns();
  rsdns.auth_token = req.session.dns_auth_token;
  rsdns.acct_num = req.session.dns_acct_num;
  console.log(req.params.domainId);
  rsdns.getDomainDetails(req.params.domainId, true, 0, function(data) {
    var records = JSON.parse(data);
    //console.log(records.recordsList.records);
    res.render('details', { records : records.recordsList.records });
  });
};
