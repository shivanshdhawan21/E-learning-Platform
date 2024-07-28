const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  type: { type: String }
});



// Get User By Id
userSchema.methods.findUserById = (id) => {
	return User.findById(id);
}

// Get User by Username
userSchema.methods.findUserByUsername = (username) => {
	return User.findOne({username: username});
}

// User check password
userSchema.methods.checkPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Save student
userSchema.statics.saveStudent = (newUser, newStudent) => {
	return newUser.save().then(() => {
    newStudent.save();
  });
};

// Save instructor 
userSchema.statics.saveInstructor = (newUser, newInstructor) => {
	return newUser.save().then(() => {
    newInstructor.save();
  });
}

userSchema.statics.updateStudent = (user, doc) => {
  // update student profile
}

userSchema.statics.updateInstructor = (user, doc) => {
  // update instructor profile
}


// Defines a function that runs before model is saved
userSchema.pre("save", function(next) {
  // Saves a reference to the user
  var user = this;
  // Skips this logic if password isn’t modified
  if (!user.isModified('password')) {
    return next();
  }
  // Generates a salt for the hash, and calls the inner function once completed
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return next(err); }
    // Hashes the user’s password
    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) { return next(err); }
      // Stores the password and continues with the saving
      user.password = hashedPassword;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
