'use strict';

var express = require('express');
var path = require('path');
var app = express();

var wiki = require('./api/wikipedia')
var quote = require('./api/wikiquote')


// configure Express
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static('dist'));
app.listen(3000);

quote.get(function(title){
  console.log(title);
});

app.get('/', function (req, res) {
  wiki.get(artist => {
    quote.get(title => {
      res.render('index', {albumArtist: artist, albumTitle: title});
    });
  });

});
