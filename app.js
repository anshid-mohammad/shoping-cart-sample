var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const fileUpload = require('express-fileupload');
var db=require('./config/connection')
var session=require('express-session')
// const { partials } = require('handlebars');



var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',                      // File extension for Handlebars files
  defaultLayout: 'layout',              // Correct spelling: 'defaultLayout'
  layoutsDir: __dirname + '/views/layout/',  // Directory for layout files
  partialsDir: __dirname + '/views/partials/' // Directory for partials
}));
// app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"key",cookie:{maxAge:60000}}))

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Successfully connected to database');
    }
});


app.use('/', userRouter);
app.use('/admin', adminRouter);
// bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
// bootstrap

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
  res.render('error');
});

module.exports = app;
