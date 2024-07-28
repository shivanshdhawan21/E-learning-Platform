const router = require('express').Router();
const Course = require("./../models/course");
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// GET homepage
router.get("/", (req, res, next) => {
  Course.findCourses().then((courses) => {
    res.render('index', { title: 'Home', courses: courses });
  }).catch(next);
});

// GET specific dashboard
router.get("/dashboard", ensureAuthenticated, function(req, res) {
  res.redirect(`${req.user.type}s/dashboard`);
});

// GET about page 
router.get("/about", function(req, res) {
  res.render('about', {title: 'About'});
});


module.exports = router;
