/***
  get signup
  post signup
  passport: serialize, deserialize, LocalStrategy
  get login
  post login
  get logout
***/

const router = require("express").Router();
const passport = require("passport");
const User = require("./../models/user");
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');
const { check, validationResult } = require('express-validator/check');

// GET signup page
router.get("/signup", function(req, res) {
  res.render("users/signup", {title: 'ELEARN | Sign up'});
});

// POST signup and do login
router.post("/signup", [
  // Form Validation
	check('first_name', 'First name field is required').not().isEmpty(),
	check('last_name').not().isEmpty().withMessage('Last name field is required'),
	check('email').not().isEmpty().withMessage('Email field is required'),
	check('email').isEmail().withMessage('Email must be a valid email address'),
	check('username').not().isEmpty().withMessage('Username field is required'),
	check('password').not().isEmpty().withMessage('Password field is required'),
	// check('password2').equals(req.body.password).withMessage('Passwords do not match')
  check('password2').custom((value, {req}) => {return value == req.body.password;}).withMessage('Passwords do not match')
], function(req, res, next) {
  // Get Form Values
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;
	const type = req.body.type;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    errors.array().forEach(function(error) {
      req.flash('error', error.msg);
    });
    res.redirect('/users/signup');
    return;
	}

  // Calls findOne to return just one user. match the username.
  User.findOne({ username: username }).then((user) => {
    // If user, bail out.
    if (user) {
      req.flash('error', 'User already exists');
      res.redirect('/users/signup');
      return;
    }
    // Creates a new instance of the User model with username, password, type
    const newUser = new User({
      email: email,
      username:username,
      password: password,
      type: type
    });

    if(type == 'student'){
      console.log('Registering Student...');

      const newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username:username
      });

      User.saveStudent(newUser, newStudent).then((user) => {
        console.log('Student created');
        req.flash('info', 'User Added');
        next();
      });
    } else {
      console.log('Registering Instructor...');
      const newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username
      });

      User.saveInstructor(newUser, newInstructor).then((user) => {
        console.log('Instructor created');
        req.flash('info', 'User Added');
        next();
      });
    }
  }).catch(next);
},
// after signup, do login
passport.authenticate('login', {
  // Authenticates the user
  successRedirect: '/dashboard',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

// GET login page
router.get("/login", function(req, res) {
  res.render("users/login", {title: 'ELEARN | Login'});
});

// POST login
// passport.authenticate returns a request handler function
router.post("/login", passport.authenticate("login", {
  successRedirect: "/dashboard",
  failureRedirect: "/users/login",
  // Sets an error message with connect-flash if the user fails to log in
  failureFlash: true
}));

// GET logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("info", "You've been logged out");
  res.redirect("/");
});

// GET user profile
router.get("/:username", ensureAuthenticated, (req, res, next) => {
  User.findOne({ username: req.params.username }).then((user) => {
    if (!user) { return next(404); }
    if (user.type == 'student') {
      Student.findStudentByUsername(user.username).then((student) => {
        res.render("users/profile", { title: 'ELEARN | Profile', fullUser: student });
      });
    } else {
      Instructor.findInstructorByUsername(user.username).then((instructor) => {
        res.render("users/profile", { title: 'ELEARN | Profile', fullUser: instructor });
      });
    }
  }).catch(next);
});

// GET profile edit page
router.get("/:username/edit", ensureAuthenticated, (req, res, next) => {
  User.findOne({ username: req.params.username }).then((user) => {
    if (!user) { return next(404); }
    res.render("users/edit", { title: 'ELEARN | Edit Profile', user: user });
  }).catch(next);
});

// Modify profile
router.post('/:username/edit', ensureAuthenticated, function(req, res) {
  const username = req.body.username;
  const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const email = req.body.email;

  req.flash("error", "Error while updating the profile. You might try again later.");
  res.redirect(`/users/${username}/edit`);
});


module.exports = router;
