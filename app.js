/**
 * Module dependencies.
 */

var express = require('express'), less = require('less'), config = require('./config'), fs = require('fs');

var app = module.exports = express.createServer(
// {
// key: fs.readFileSync('/var/node/server.key'),
// cert: fs.readFileSync('/var/node/server.crt')
// }
);
var MemoryStore = require('connect').session.MemoryStore;

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {
		layout : false
	});
	app.use(express.compiler({
		src : __dirname + '/public/less',
		enable : [ 'less' ]
	}));
	app.register('.html', {
		compile : function(str, options) {
			return function(locals) {
				return str;
			};
		}
	});
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'your secret here',
		store : new MemoryStore({
			reapInterval : 60000 * 10
		})
	}));
	app.dynamicHelpers({
		session : function(req, res) {
			return req.session;
		},
		flashMessages : function(req, res) {
			var html = '';
			[ 'error', 'info' ].forEach(function(type) {
				var messages = req.flash(type);
				if (messages.length > 0) {
					html = messages;
				}
			});
			return html;
		}
	});
	app.use(app.router);
	app.use('/public', express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

app.error(function(err, req, res, next) {
	console.log(err);
});

// Routes
require('./routes')(app);

app.listen(config.node_port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
