var auth = require('../auth'), spawn = require('child_process').spawn;

/*
 * GET traceroute page.
 */
module.exports = function(app) {

	var dnsauth = new auth();
	var trace_cmd = "tracepath";
	var trace_cmd_6 = "tracepath6";

	app.get('/traceroute', dnsauth.checkSessionDns, function(req, res) {
		res.render('traceroute');
	});

	app.post('/traceroute', dnsauth.checkSessionDns, function(req, res) {
		var output = "";
		if (req.body.v6 == 'on') {
			dig = spawn(trace_cmd_6, [ req.body.host ]);
		} else {
			dig = spawn(trace_cmd, [ req.body.host ]);
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
