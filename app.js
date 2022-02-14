require("babel-polyfill");
//handle errors
var createError = require('http-errors');

//cookie-parser
var cookieParser = require('cookie-parser');

//morgan
var logger = require('morgan');

//body-parser
const bodyParser = require('body-parser'); 

//encrypt user pass
// const bcrypt = require('bcrypt');

//flash messages
var flash = require('connect-flash');
//express
const express = require('express');
const app = express();

//path
const path = require('path');

//mongoose
const mongoose = require('mongoose');

//.env file
var env = require('dotenv').config();

//express session
const session = require("express-session");

//connect-mongo
const MongoStore = require('connect-mongo');

//passport
const passport = require("passport");

//passport local
const LocalStrategy = require("passport-local").Strategy;

// app routes
const appRoutes = require('./routes/app_routes');

// doc routes
const docRoutes = require('./routes/doc_routes');

// app routes
const guestRoutes = require('./routes/guest_routes');

//db
const connectDB = require('./db/connect');

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

//session middleware
app.use(session({
  secret: 'This my secret*&^((*E&()))',
  saveUninitialized: true, // don't create session until something stored
  resave: false, //don't save session if unmodified
  cookie: {maxAge: 1000*60*60*24 /*one day*/},
  store: MongoStore.create({
    mongoUrl: /*'mongodb://localhost:27017/antecare'*/process.env.URI,
    touchAfter: 24 * 3600 // time period in seconds
  }),
}));

//flash middleware
app.use(flash());



//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//register partials
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/includes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app routes
app.use('/', appRoutes);

//passport - apply passport auth to doc routes only
require('./config/passport')
app.use('/doc',passport.initialize())
app.use('/doc',passport.session())
app.use('/doc',function(req, res, next){
    console.log(req.session)
    console.log(req.user)
    next()
})

//doc routes
app.use('/doc', docRoutes);

//guest routes
app.use('/guest', guestRoutes);

//login failure
app.get('/login-failure', (req, res, next) => {
    res.json({error: "Invalid Credentials.",});
});

// app.get('/doc/flash', function(req, res){
//   // Set a flash message by passing the key, followed by the value, to req.flash().
//   req.flash('info', 'Flash is back!')
//   res.redirect('/doc/dashboard');
// });


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