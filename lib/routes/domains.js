var DNS = require('../dns'), Auth = require('../auth'), Domain = require('../Domain');

/*
 * GET domains page.
 */
module.exports = function(app) {

	var dnsauth = new Auth();

	app.get('/', dnsauth.checkSessionDns, function(req, res) {
		res.redirect('/domains');
	});

	app.get('/domains', dnsauth.checkSessionDns, function(req, res) {
		var rsdns = new DNS();
		rsdns.initialize(req.session.dns_name, req.session.dns_key, function(err, data) {
			if (err)
				throw err;
			var result = JSON.parse(data);
			if (result.message)
				res.render('index', {
					errorMessage : result.message
				});
			else {
				req.session.dns_auth_token = result.auth_token;
				req.session.dns_acct_num = result.acct_num;
				rsdns.getDomains(function(data) {
					var domains = JSON.parse(data);
					res.render('domains', {
						domains : domains.domains
					});
				});
			}
		});
	});

	app.post('/', dnsauth.authenticate, function(req, res) {
		res.redirect('/domains');
	});

	app.post('/domains', dnsauth.checkSessionDns, function(req, res) {
		var rsdns = new DNS();
		rsdns.auth_token = req.session.dns_auth_token;
		rsdns.acct_num = req.session.dns_acct_num;

		var addArray = [];
		var modArray = [];
		var delArray = [];
		var nameIndex = 0;
		for ( var i = 0; i < req.body.domain_id.length; i++) {
			var domain = new Domain();
			if (req.body.status[i] === 'A') {
				if (typeof req.body.domain_name === 'string') {
					domain.initAdd(req.body.domain_name, req.body.domain_comment[i], req.body.domain_ttl[i], req.body.domain_emailAddress[i]);
				} else {
					domain.initAdd(req.body.domain_name[nameIndex], req.body.domain_comment[i], req.body.domain_ttl[i], req.body.domain_emailAddress[i]);
					nameIndex++;
				}
				addArray.push(domain);
			} else if (req.body.status[i] === 'M') {
				domain.initAll('', req.body.domain_id[i], req.body.domain_comment[i], req.body.domain_accountId[i], req.body.domain_ttl[i], req.body.domain_emailAddress[i], req.body.domain_updated[i], req.body.domain_created[i]);
				modArray.push(domain);
			} else if (req.body.status[i] === 'R') {
				domain.initDel(req.body.domain_id[i]);
				delArray.push(domain);
			}
		}
		if (addArray.length > 0) {
			rsdns.createDomains(addArray, function(data) {
				var message = JSON.parse(data);
				if (message.validationErrors) {
					console.log('error message: ' + message.validationErrors.messages);
					res.send(message.validationErrors.messages);
				} else {
					res.send('success');
				}
			});
		}
		if (modArray.length > 0) {
			rsdns.modifyDomains(modArray, function(data) {
				var message = JSON.parse(data);
				if (message.validationErrors) {
					console.log('error message: ' + message.validationErrors.messages);
					res.send(message.validationErrors.messages);
				} else {
					res.send('success');
				}
			});
		}
		if (delArray.length > 0) {
			rsdns.removeDomains(delArray, true, function(data) {
				var message = JSON.parse(data);
				if (message.validationErrors) {
					console.log('error message: ' + message.validationErrors.messages);
					res.send(message.validationErrors.messages);
				} else {
					res.send('success');
				}
			});
		}

	});

};
