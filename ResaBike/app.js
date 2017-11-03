// all the required modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//all the routes
var index = require('./routes/index');
var zone = require('./routes/zone');
var book = require('./routes/book');
var user = require('./routes/user');
var bookings = require('./routes/bookings');

//express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next){
//   if (req.url == "/") {
//     res.redirect("/en");
//     return;
//   } 
//   var langUrl = req.url.split('/');
//   var newUrl = "/";
//   for (var i = 2; i < langUrl.length; i++) {
//     newUrl += langUrl[i] + "/";
//   }
//   if (newUrl.length > 1) {
//     newUrl = newUrl.slice(0, -1);
//   }

//   req.url = newUrl;
//   var lang = require('./lang/' + langUrl[1] + '.js');
//   res.locals.lang = lang;
//   res.locals.langUsed = langUrl[1];
  
// next();

// });

app.use('/', index);
app.use('/zone', zone);
app.use('/book', book);
app.use('/user', user);
app.use('/bookings', bookings);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  //Redirecting to index if there is any error
  res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
