var createError = require('http-errors');

var express = require('express');
var session = require('express-session'); 
var exphbs  = require('express-handlebars');

var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');

var logger = require('morgan');
var dotenv = require('dotenv')
var path = require('path');

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/user')

var app = express();

require('./database/connection')

// env variables
dotenv.config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  partialsDir: __dirname + '/views/partials',
  extname: '.hbs',
  //helpers: require('./lib/helpers')
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport
require('./passport/auth')
app.use(session({
  secret: process.env.SESSION_PASSWORD,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.successEvent = req.flash('messageSuccess');
  res.locals.failureEvent = req.flash('messageFailure');
  next();
});

app.use('/', indexRouter);
app.use('/user', registerRouter)

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('partials/error');
});

module.exports = app;
