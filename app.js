var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_api/config/dbConnection');

//Routes
var persons = require('./app_api/routes/persons');
var teams = require('./app_api/routes/teams');

var app = express();

var mung = require('express-mung');

//middleware to access response body object 
app.use(mung.json(
        function transform(body, req, res) {
            // do something with body
            if (body.data && body.data._id) {
                body.data.id = body.data._id;
                delete body.data._id;
            }
            return body;
       }
));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/v1/persons', persons);
app.use('/api/v1/teams', teams);

module.exports = app;