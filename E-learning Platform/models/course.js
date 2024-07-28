var mongoose = require('mongoose');

// Course Schema
var CourseSchema = mongoose.Schema({
	title: {
		type: String
	},
	topic: {
		type: String
	},
	description: {
		type: String
	},
	instructor:{
		type: String
	},
	students: [{
		student_username: {type: String}
	}],
	lessons:[{
		lesson_number: {type: Number},
		lesson_title: {type: String},
		lesson_body: {type: String}
	}]
});

// Fetch All Courses
CourseSchema.statics.findCourses = () => {
	return Course.find().sort({ createdAt: 'descending' });
};


// Fetch Single Course
CourseSchema.statics.findCourseById = (id) => {
	return Course.findById(id);
};

// Add Lesson
CourseSchema.statics.addLesson = (info) => {
	courseId = info['courseId'];
	lesson_number = info['lesson_number'];
	lesson_title = info['lesson_title'];
	lesson_body = info['lesson_body'];

	return Course.findByIdAndUpdate(courseId, {
		$push: {'lessons': {lesson_number: lesson_number, lesson_title: lesson_title, lesson_body:lesson_body}}
	}, { safe: true, upsert: true });
};

// Modify Course
CourseSchema.statics.modifyCourse = (info) => {
	courseId = info['courseId'];
	title = info['newTitle'];
	description = info['newDescription'];

	return Course.findByIdAndUpdate(courseId, {
		$set: {description: description, title: title}
	}, {safe: true, upsert: true});
};


const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
