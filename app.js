
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , dns = require('./dns');

var app = module.exports = express.createServer();

var MemoryStore = require('connect').session.MemoryStore;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view options', {layout: false});
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
function checkSessionDns(req, res, next) {
  if (req.session.dns_name) {
    console.log("session exists " + req.session.dns_name);
    console.log("auth token " + req.session.dns_auth_token);
    console.log("acct num " + req.session.dns_acct_num);
  }
  else {
    req.session.dns_name = 'kmulvey'; //replace later with redirect to login page
    req.session.dns_key = 'd6cecb77f407e81b58a8dcfa7a33384b'; //once logged in, dns key will be retrieved from db
  }
  next();
};

app.error(function(err, req, res, next){
  console.log(err); 
});

// Routes

app.get('/', checkSessionDns, routes.index);

app.get('/details', checkSessionDns, routes.details);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
