'use strict';

var express = require('express');
var path = require('path');
var app = express();

// configure Express
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static('dist'));
app.listen(3000);

// app.get('/', function (req, res) {
app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});
