const unsplashLib = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const fetch = require('isomorphic-fetch');

var config = require('./unsplash-config.json');

const unsplash = new unsplashLib({
  applicationId: config.appId,
  secret: config.secret,
  callbackUrl: config.callbackUrl
});

module.exports = {
  getPhoto: getPhoto
};

function getPhoto(callback) {
  unsplash.photos.getRandomPhoto()
    .then(toJson)
    .then(json => {
      callback(json.urls);
    });
}
