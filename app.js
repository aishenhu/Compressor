
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , compressor = require('compressor');

var app = express();
var fm = require('compressor/filemanager');
//fm.filemanage();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir: './uploads'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    res.send('404,Page not exist!');
  });

  // error-handling middleware, take the same form
  // as regular middleware, however they require an
  // arity of 4, aka the signature (err, req, res, next).
  // when connect has an error, it will invoke ONLY error-handling
  // middleware.

  // If we were to next() here any remaining non-error-handling
  // middleware would then be executed, or if we next(err) to
  // continue passing the error, only error-handling middleware
  // would remain being executed, however here
  // we simply respond with an error page.


  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.send('500, System error');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/download', function(req, res, next){
  console.log('download...' + req.query.file, req.query);
  res.download(__dirname + '/tmp/'+req.query.file);
});


app.post('/compress', function(req, res, next){
  var param = {};
  param.type = parseInt(req.body.type);
  param.text = req.body.content;
  param.files = req.files.cfile;
  param.url = req.body.url;
  param.callback = function(msg){
    var ret = '<script> var msg = ' + JSON.stringify(msg) + ';parent.Compressor.callback(msg);</script>';
    res.send(ret);
  }
  compressor.compress(param);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
