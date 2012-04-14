var Auth = require('../auth'), spawn = require('child_process').spawn;

/*
 * GET digs page.
 */
module.exports = function(app) {
	var dnsauth = new Auth();
	app.get('/dig', dnsauth.checkSessionDns, function(req, res) {
		res.render('dig');
	});
	app.post('/dig', dnsauth.checkSessionDns, function(req, res) {
		var dig = spawn('dig', [ req.body.type, '+trace', req.body.host ]);
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
