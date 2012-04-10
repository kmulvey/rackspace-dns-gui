var auth = require('../auth'), spawn = require('child_process').spawn;

/*
 * GET nslookup page.
 */
module.exports = function(app) {

	var dnsauth = new auth();

	app.get('/nslookup', dnsauth.checkSessionDns, function(req, res) {
		res.render('nslookup');
	});

	app.post('/nslookup', dnsauth.checkSessionDns, function(req, res) {
		dig = spawn('nslookup', [ req.body.host ]);
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
