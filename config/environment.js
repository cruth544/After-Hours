var _ = require('lodash');

var localEnvVars = {
  TITLE:      '../after-hours/',
  SAFE_TITLE: '../after-hours/'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
