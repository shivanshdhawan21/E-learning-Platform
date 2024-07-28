require('./config/config.js');

const createError = require('http-errors');
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressValidator = require('express-validator');
const flash = require("connect-flash");
const passport = require("passport");
// single funtion to set up passport
const setUpPassport = require("./setuppassport");

// Connect to MongoDB server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(() => {
  console.log('Connected to MongoDB.');
}).catch((err) => {
  console.log('Unable to connnect to MongoDB:', err.message);
});

const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');
const instructorsRouter = require('./routes/instructors');
const coursesRouter = require('./routes/courses');

// set up passport
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "TKRv0IJsHYqrvagQ#&!F!%V]Ww/4KiVs$s<<MX",
  resave: true,
  saveUninitialized: true
}));
// Initializes the Passport module and Handles Passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  // set locals with eventual flash error and info messages.
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  next();
});

// Set useful variables for templates
app.use(function(req, res, next) {
  // Every view will have access to currentUser, which pulls from req.user, which is populated by Passport.
  res.locals.currentUser = req.user;
  if(req.user) {
    res.locals.type = req.user.type;
  }
  next();
});


// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);
app.use('/instructors', instructorsRouter);
app.use('/courses', coursesRouter);


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
  res.render('error', { title: 'Error!' });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
