const mongoose = require('mongoose');
const Course = require('./course');

// Student Schema
const StudentSchema = mongoose.Schema({
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
		course_title: {type:String}
	}]
});

// Find student by username
StudentSchema.statics.findStudentByUsername = (username) => {
	return Student.findOne({username: username});
}

// Register Student for Class
StudentSchema.statics.register = (info) => {
  student_username = info['student_username'];
  course_id = info['course_id'];
  course_title = info['course_title'];

	return Course.findOneAndUpdate({_id: course_id},
		{$push: {'students': {student_username: student_username}}},
		{safe: true, upsert: true}
	).then(() => {
		return Student.findOneAndUpdate({username: student_username},
			{$push: {"courses": {course_id: course_id, course_title: course_title}}},
			{safe: true, upsert: true}
		);
	});
}

// // find courses by student
// StudentSchema.statics.findCourses = (user) => {
// 	return Student.findOne({username: user.username}).then((student) => {
// 		return student.courses;
// 	});
// }

// Find registered courses of a student
StudentSchema.statics.findStudentCourses = (user) => {
	return Course.find({"students.student_username": user.username});
}


var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
