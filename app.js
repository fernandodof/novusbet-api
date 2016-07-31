var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_api/config/dbConnection');

var app = express();

//Routes
var persons = require('./app_api/routes/persons');
var teams = require('./app_api/routes/teams');
var championships = require('./app_api/routes/championships');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/v1/persons', persons);
app.use('/api/v1/teams', teams);
app.use('/api/v1/championships', championships);

module.exports = app;