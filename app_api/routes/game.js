var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var util = require('../util/sharedFunctions');
var async = require('async');

