var dns = require('../dns'), auth = require('../auth');

/*
 * GET domains page.
 */
module.exports = function(app) {
 
  var dnsauth = new auth();
 
  app.get('/', dnsauth.checkSessionDns, load); 

  app.get('/domains', dnsauth.checkSessionDns, load);

  app.post('/login', dnsauth.authenticate, load);

  function load(req, res){
    var rsdns = new dns();
    rsdns.initialize(req.session.dns_name, req.session.dns_key, function(err, data) {
      if (err) throw err;
      var result = JSON.parse(data);
      if (result.message) res.render('index', { errorMessage : result.message });
      else {
        req.session.dns_auth_token = result.auth_token;
        req.session.dns_acct_num = result.acct_num;
        rsdns.getDomains( function(data) {
          var domains = JSON.parse(data);
          //console.log(domains.domains);
          res.render('domains', { domains : domains.domains });
        });
      }
    });
  };
};
