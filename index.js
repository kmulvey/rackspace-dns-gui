var dns = require('./dns'), express = require('express'), fs = require('fs');
var app = module.exports = express.createServer();
var domains;

// Express Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
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

// send html page back
app.get('/', function(req, res) {
	domains = new dns();
	// domains.init();

	res.sendfile(__dirname + '/index.html');
	console.log('conntected from ' + req.connection.remoteAddress);
});

// Start server
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);