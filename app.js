
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , dns = require('./dns')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function checkSessionDns(req, res, next) {
  if (req.session.dns) next();
  else req.session.dns = new dns(); //replace later with redirect to login page
  next();
};

app.error(function(err, req, res, next){
  console.log(err); 
});

// Routes

app.get('/', checkSessionDns, routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
