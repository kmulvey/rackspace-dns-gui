var fs = require('fs'), auth = require('../auth'), db = require('../db'), config = require('../config'), email = require('mailer');

module.exports = function(app) {

	var dnsauth = new auth();
	var rsdb = new db();

	fs.readdirSync(__dirname).forEach(function(file) {
		if (file == "index.js")
			return;
		var name = file.substr(0, file.indexOf('.'));
		require('./' + name)(app);
	});

	app.get('/logout', dnsauth.logout, function(req, res) {
		req.flash('info', 'You have successfully logged out.');
		res.redirect('/login');
	});

	app.post('/create_acct', function(req, res) {
		rsdb.addUser(req.body.username, req.body.r_api_key, req.body.password, req.body.email, req.body.r_username, function(err, data) {
			if (err)
				throw err;
			if (data) {
				res.send(data);
			}
		});
	});

	app.post('/passwd_reset', function(req, res) {
		rsdb.validateEmail(req.body.email, function(err, data) {
			if (err)
				throw err;
			if (!data) {
				res.send('Not a valid email.');
			} else
				email.send({
					host : config.smtp_host,
					port : config.smtp_port,
					domain : config.smtp_domain,
					to : req.body.email, // to : "king.feruke@gmail.com",
					from : config.mail_from,
					subject : "DNS Password reset",
					template : "reset_email.txt",
					data : {
						"name" : "Kevin",
						"url" : "http://theorywednesday.com"
					},
				}, function(err, result) {
					if (err) {
						res.send(err);
					} else {
						res.send(result);
					}
				});
		});

	});
};
