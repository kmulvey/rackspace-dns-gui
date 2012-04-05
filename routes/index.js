var fs = require('fs'), auth = require('../auth'), db = require('../db'), config = require('../config'), nodemailer = require('nodemailer');

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
			else if (!data) {
				res.send('Not a valid email.');
			} else {
				// generate uri and store it
				rsdb.genResetURI(data, function(err, data) {
					if (err)
						throw err;
					else if (!data) {
						res.send('Not a valid email.');
					} else {}
				});
				
				var transport = nodemailer.createTransport("SMTP", {
					host : config.smtp_host,
					port : config.smtp_port,
					debug : 'true'
				});

				var message = {
					from : config.email_from,
					to : req.body.email,
					subject : "DNS Password reset",
					text : 'Follow the below link to reset your password.'
				};

				transport.sendMail(message, function(error) {
					if (error) {
						console.log('Error occured');
						console.log(error.message);
						return;
					}
					console.log('Message sent successfully!');
					transport.close();
				});
			}
		});

	});
};
