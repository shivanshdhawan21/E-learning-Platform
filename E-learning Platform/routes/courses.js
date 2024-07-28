const router = require('express').Router();

const Course = require('./../models/course');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// GET course details
router.get('/:id/details', (req, res, next) => {
  var courseId = req.params.id;
  Course.findCourseById(courseId).then((course) => {
    res.render('courses/details', { title: 'ELEARN | Details', course: course });
  }).catch(next);
});

// Get Lesson
router.get('/:courseId/lessons/:lesson_id', ensureAuthenticated, (req, res, next) => {
  Course.findCourseById([req.params.courseId]).then((course) => {
    var lesson = course.lessons.filter(lesson => lesson._id == req.params.lesson_id)[0];
    res.render('courses/lesson', { title: 'ELEARN | Lesson', course: course, lesson: lesson });
  }).catch(next);
});

// GET all courses
router.get('/all', (req, res, next) => {
  Course.findCourses().then((courses) => {
    res.render('courses/all', { title: 'All Courses', courses: courses });
  }).catch(next);
});

module.exports = router;
