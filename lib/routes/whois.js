var Auth = require('../auth'), spawn = require('child_process').spawn;

/*
 * GET whois page.
 */
module.exports = function(app) {

	var dnsauth = new Auth();

	app.get('/whois', dnsauth.checkSessionDns, function(req, res) {
		res.render('whois');
	});

	app.post('/whois', dnsauth.checkSessionDns, function(req, res) {
		var dig = spawn('whois', [ req.body.host ]);
		dig.stdout.on('data', function(data) {
			res.render('tools-result', {
				result : data
			});
		});
		dig.stderr.on('error', function(data) {
			res.render('tools-result', {
				result : 'ERROR: ' + data
			});
		});
	});

};
