'use strict';

var mwApi = require('nodemw');

var client = new mwApi({
  protocol: 'https',
  server: 'en.wikipedia.org',
  path: '/w',
  debug: true
});

var params = {
  action: 'query',
  generator: 'random',
  grnnamespace: '0',
  grnlimit: '1'
};

module.exports = {
  get: get
};

function get(callback) {
  client.api.call(params, function(err, info, next, data){
    var p = data.query.pages;
    var title = 'Nothing';
    for(var key in p) {
      if(p.hasOwnProperty(key)) {
        title = p[key].title;
        break;
      }
    }
    callback(title);
  });
/*
  client.fetchUrl('https://en.wikipedia.org/wiki/Special:Random', function(err,data){
      console.log(data);
  });
  */
}
