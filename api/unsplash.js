const unsplashLib = require('unsplash-js');

var config = require('./unsplash-config.json');

const unsplash = new unsplashLib({
  applicationId: config.appId,
  secret: config.secret,
  callbackUrl: config.callbackUrl
});

module.exports = {
};
