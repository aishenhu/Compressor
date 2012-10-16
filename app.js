
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , exec = require('child_process').exec
  , fs = require('fs')
  , compressor = require('compressor');

var app = express();
var fm = require('compressor/filemanager');
fm.filemanage();

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
  param.url = req.body.curl;
  param.filetype = req.body.filetype.toLowerCase();
  param.cmethod = req.body.cmethod; //1 batch; 2 combine

  //compress options
  param.verbose = req.body.verbose || '';
  param.linebreak = req.body.jslinebreak || -1;
  param.nomunge = req.body.nomunge || '';
  param.semi = req.body.semi || '';
  param.nooptimize = req.body.nooptimize || '';


  var total = 0;
  var retmsg = [];

  //convert option to string
  var option = (function(){
    var str = " ";
    if(param.linebreak > -1){
      str += "--line-break " + param.linebreak + " "
    }
    if(param.nomunge == 'on'){
      str += " --nomunge ";
    }
    if(param.semi == 'on'){
      str += " --preserve-semi ";
    }
    if(param.nooptimize == 'on'){
      str += ' --disable-optimizations ';
    }
    return str;
  })();

  param.option = option;
  switch(param.type){
    case 0:
      total = 1;
      break;
    case 1:
      total = Object.prototype.toString.call( param.files ) === '[object Array]' ? param.files.length : 1;
      break;
    case 2:
      total = Object.prototype.toString.call( param.url ) === '[object Array]' ? param.url.length : 1;
  }

  //define the callback function, invoked when a file is compressed 
  param.callback = function(msg){
    retmsg.push(msg);
    if(retmsg.length == total){
      // batch process 
      if(param.cmethod == 1){
        var tarResultName = (+new Date()) + '.tar.gz';
        var tarCommand = 'cd tmp && tar -zcvf ' + tarResultName + ' ';
        for(var i in retmsg){
          tarCommand += retmsg[i].path + ' ';
        }
        exec(tarCommand, function(err){
          if(err){
            console.log(err);
          }

          var ret = '<script>var p = "' + tarResultName + '";var msg = ' + JSON.stringify(retmsg) + ';parent.Compressor.callback(msg,p);</script>';
          res.send(ret);
          res.end();  
          
        });
      }else{
        var combineCommand = "cd tmp && cat ";
        var originSize = 0;
        var resultSize = 0;
        for(var i in retmsg){
          combineCommand += retmsg[i].path + ' ';
          originSize += retmsg[i].originSize;
        }
        var resultPath = (+new Date()) + '.all.'+ param.filetype;
        combineCommand += ' > '+ resultPath;
        exec(combineCommand, function(err){
          if(err){
            console.log(err);
          }
          fs.stat('tmp/'+resultPath, function(err, stats){
            resultSize = stats.size;
            if(err){
              console.log('err', err);
            }
            var retmsg = [{
              'path': resultPath,
              'name': resultPath,
              'msg': 'compress success',
              'originSize': originSize,
              'resultSize': resultSize
            }];
            var ret = '<script>var msg = ' + JSON.stringify(retmsg) + ';parent.Compressor.callback(msg);</script>';
            res.send(ret);
            res.end();  
          });
        });
      }    
    }    
  }
  compressor.compress(param);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
