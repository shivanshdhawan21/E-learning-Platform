// In "production" and "test" NODE_ENV exists, so we set the env variable accordingly,
var env = process.env.NODE_ENV || 'development';
console.log('* You are in ***', env, '*** environment *');

// in config.json we specify any local environment variables (that is dev or test environment)
if (env === 'development' || env === 'test') {
  // when require a json file it automatically parse it in a js object
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach(function(key) {
    process.env[key] = envConfig[key];
  });
}
