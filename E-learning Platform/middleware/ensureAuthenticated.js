function ensureAuthenticated(req, res, next) {
  // A function provided by Passport
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You must be logged in to see that page.');
    res.redirect('/users/login');
  }
}

module.exports = ensureAuthenticated;
