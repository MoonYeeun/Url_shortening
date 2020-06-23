const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');


// LOAD API FROM ROUTES
const app = express();
let port = 8080;
var urlShort = require('./routes/urlShort');
var urlDirect = require('./routes/urlDirect');

// SETUP MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/urlShort',urlShort); // url shortening
app.use('/', urlDirect); // url redirect 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});