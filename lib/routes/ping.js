var Auth = require('../auth'), spawn = require('child_process').spawn;

/*
 * GET ping page.
 */
module.exports = function(app) {

	var dnsauth = new Auth();

	app.get('/ping', dnsauth.checkSessionDns, function(req, res) {
		res.render('ping');
	});

	app.post('/ping', dnsauth.checkSessionDns, function(req, res) {
		var output = "";
		var dig = null;
		if (req.body.v6 === 'on') {
			dig = spawn('ping6', [ '-c 5', req.body.host ]);
		} else {
			dig = spawn('ping', [ '-c 5', req.body.host ]);
		}
		dig.stdout.on('data', function(data) {
			output += data;
		});
		dig.stderr.on('end', function(data) {
			res.render('tools-result', {
				result : output
			});
		});
		dig.stderr.on('close', function(data) {
			res.render('tools-result', {
				result : output
			});
		});
		dig.stderr.on('error', function(data) {
			res.render('tools-result', {
				result : 'ERROR: ' + data
			});
		});
	});

};
