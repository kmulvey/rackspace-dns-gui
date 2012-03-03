
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , dns = require('./dns')
  , db = require('./db')
  , util = require('util')
  , less = require('less')
  , spawn = require('child_process').spawn;

var app = module.exports = express.createServer();

var MemoryStore = require('connect').session.MemoryStore;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.compiler({ src: __dirname + '/public/less', enable: ['less']}));
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here', store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
  app.dynamicHelpers({ session: function(req, res) { return req.session; } });
  app.use(app.router);
  app.use('/public', express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var rsdns = new dns();
var rsdb = new db();

function checkSessionDns(req, res, next) {
  if (req.session.dns_name) {
    console.log("session exists " + req.session.dns_name);
    console.log("auth token " + req.session.dns_auth_token);
    console.log("acct num " + req.session.dns_acct_num);
    next();
  } else {
	  res.render('index');
  }
};

function authenticate(req, res, next) {
  console.log(req.body);
  rsdb.getKey(req.body.username, function (err, data) {
    if (err) throw err;
    if( data) {
      var dbres = JSON.parse(data);      
      if (dbres.results.length == 0) {
        res.render('login.html'); 
      } else {
        req.session.dns_name = dbres.results[0].name;
        req.session.dns_key = dbres.results[0].key;
        next();
      }
    } else {
      res.render('login.html');
    }
  });
};

app.error(function(err, req, res, next){
  console.log(err); 
});

// Routes

app.get('/', checkSessionDns, routes.index);

app.post('/domains', function(req, res){
	res.render('domains');
});

app.get('/details', function(req, res){
	res.render('details');
});

app.get('/details/:domainId', checkSessionDns, routes.details);

app.get('/dig', function(req, res){
	res.render('dig');
});
app.post('/dig', function(req, res){
	dig = spawn('dig', [ req.body.type, '+trace', req.body.host ]);
	dig.stdout.on('data', function(data) {
		res.render('tools-result', {result: data});
	});
	dig.stderr.on('data', function(data) {
		res.render('tools-result', {result: 'ERROR: ' + data});
	});
});

app.get('/whois', function(req, res){
	res.render('whois');
});
app.post('/whois', function(req, res){
	dig = spawn('whois', [ req.body.host ]);
	dig.stdout.on('data', function(data) {
		res.render('tools-result', {result: data});
	});
	dig.stderr.on('data', function(data) {
		res.render('tools-result', {result: 'ERROR: ' + data});
	});
});

app.post('/login', authenticate, routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);