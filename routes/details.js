var dns = require('../dns'), auth = require('../auth'), Record = require('../Record');

/*
 * GET detail page.
 */
module.exports = function(app) {

  var dnsauth = new auth();

  app.get('/details/:domainId', dnsauth.checkSessionDns, function(req, res) {
    var rsdns = new dns();
    rsdns.auth_token = req.session.dns_auth_token;
    rsdns.acct_num = req.session.dns_acct_num;
    console.log('Domain ID: ' + req.params.domainId);
    rsdns.getDomainDetails(req.params.domainId, true, 0, function(data) {
      var records = JSON.parse(data);
      //console.log(records.recordsList.records);
      res.render('details', { records : records.recordsList.records, domainId : req.params.domainId });
    });
  }); 

  app.get('/details', dnsauth.checkSessionDns, function(req, res) {
    res.render('details');
  });

  app.post('/details', dnsauth.checkSessionDns, function(req, res) {
    console.log(req.body);
    var rsdns = new dns();
    rsdns.auth_token = req.session.dns_auth_token;
    rsdns.acct_num = req.session.dns_acct_num;

    var recordArray = [];
    for ( var i = 0; i < req.body.record_id.length; i++) {
      var record = new Record();
      record.initAll(req.body.record_name[i], req.body.record_id[i], req.body.record_type[i],
                     req.body.record_val[i], req.body.record_ttl[i], req.body.record_updated[i],
                     req.body.record_created[i]);
      recordArray.push(record);
    }
    rsdns.modifyRecords(req.body.domain_id, recordArray, function(data) {
      res.send('success');
    });
  });

};
