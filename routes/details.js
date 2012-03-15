var dns = require('../dns'), auth = require('../auth');

/*
 * GET detail page.
 */
module.exports = function(app) {

  var dnsauth = new auth();

  app.get('/details/:domainId', dnsauth.checkSessionDns, load);

  app.get('/details', dnsauth.checkSessionDns, function(req, res) {
    res.render('details');
  });

  app.post('/details', dnsauth.checkSessionDns, function(req, res) {
    console.log(req.body);
  });

  function load(req, res){
    var rsdns = new dns();
    rsdns.auth_token = req.session.dns_auth_token;
    rsdns.acct_num = req.session.dns_acct_num;
    console.log('Domain ID: ' + req.params.domainId);
    rsdns.getDomainDetails(req.params.domainId, true, 0, function(data) {
      var records = JSON.parse(data);
      //console.log(records.recordsList.records);
      res.render('details', { records : records.recordsList.records, domainId : req.params.domainId });
    });
  };

  function update(req, res){
    var rsdns = new dns();
    rsdns.auth_token = req.session.dns_auth_token;
    rsdns.acct_num = req.session.dns_acct_num;
    console.log('Body: ' + req.records[2].id);
    //rsdns.getDomainDetails(req.params.domainId, true, 0, function(data) {
      //var records = JSON.parse(data);
      //console.log(records.recordsList.records);
      //res.render('details', { records : records.recordsList.records, domainId : req.params.domainId });
    //});
    res.send('success');
  };

};
