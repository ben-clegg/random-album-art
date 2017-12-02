'use strict';

var express = require('express');
var path = require('path');
var app = express();

var wiki = require('./api/wikipedia')
var quote = require('./api/wikiquote')
var photos = require('./api/unsplash')


// configure Express
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static('dist'));
app.listen(3000);

app.get('/', function (req, res) {
  wiki.get(artist => {
    quote.get(title => {
      photos.get(photo => {
        var params = {
          albumArtist: artist,
          albumTitle: title,
          imgLink: photo.links.html,
          imgSrc: photo.urls.regular
        }
        console.log(params);
        res.render('index', params);
      });
    });
  });

});
