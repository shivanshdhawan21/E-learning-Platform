const router = require('express').Router();

const Course = require('./../models/course.js');
const Student = require('./../models/student');
const User = require('./../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// GET student dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
  Student.findStudentCourses(req.user).then((courses) => {
    res.render('students/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
  }).catch(next);
});

// Register student for a course 
router.post('/course/register', ensureAuthenticated, function(req, res, next) {
	info = [];
	info['student_username'] = req.body.student_username;
	info['course_id'] = req.body.course_id;
	info['course_title'] = req.body.course_title;

	Student.register(info).then((student) => {
    console.log(student);
    req.flash('info', 'You are now registered for the course.');
    res.redirect('/students/dashboard');
  }).catch(next);
});

// View a lesson
router.get('/:courseId/viewLessons', ensureAuthenticated, function(req, res, next) {
  var courseId = req.params.courseId;

  Course.findCourseById(courseId).then((course) => {
    res.render('students/viewLessons', {title: 'ELEARN | Lessons', course: course});
  }).catch(next);
});


module.exports = router;
