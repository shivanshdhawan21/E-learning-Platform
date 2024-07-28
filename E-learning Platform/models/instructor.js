const mongoose = require('mongoose');
const Course = require('./course');

// Instrucor Schema
const InstructorSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	courses:[{
		course_id: {type: mongoose.Schema.Types.ObjectId},
		course_title: {type: String}
	}]
});

// Find instructor by username
InstructorSchema.statics.findInstructorByUsername = (username) => {
	return Instructor.findOne({username: username});
}

// Create course
InstructorSchema.statics.createCourse = (info) => {
	const title = info['title'];
	const topic = info['topic'];
	const description = info['description'];
	const username = info['username'];

	var course = new Course({
		title,
		topic,
		description,
		instructor: username
	});

	return course.save().then((course) => {
		return Instructor.findOneAndUpdate({username: username},
			{$push: {"courses": {course_id: course._id, course_title: title}}},
			{safe: true, upsert: true}
		);
	});
};

// Find all courses by instructor 
InstructorSchema.statics.findCourses = (user) => {
	return Course.find({instructor: user.username});
}

var Instructor = mongoose.model('instructor', InstructorSchema);

module.exports = Instructor;
