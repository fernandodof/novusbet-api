var express = require('express');
var router = express.Router();
var Person = require('./../models/person');
var _ = require('lodash');
var util = require('../util/sharedFunctions');
var async = require('async');

router.route('/')
        .post(function (req, res) {
            var person = req.body;
            Person.create(person, function (err, personCreated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else {
                    var data = personCreated.toObject();
                    return util.sendResponse(res, 201, {
                        //Find a better way
                        data: _.omit(data, ['password']),
                        message: 'PERSON_CREATED'
                    });
                }
            });
        });

router.route('/:id')
        .get(function (req, res) {

            async.waterfall([
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                function (id, callback) {
                    Person.findById(req.params.id, function (err, person) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!person) {
                            return callback(util.createErrorObject('PERSON_NOT_FOUND', 404), null);
                        }

                        var result = {
                            message: 'PERSON_FOUND',
                            status: 200,
                            data: person
                        };

                        callback(null, result);
                    });
                }

            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });

        })
        .put(function (req, res) {

            async.waterfall([
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                function (id, callback) {
                    var query = {_id: id};
                    var update = req.body;

                    Person.findOneAndUpdate(query, update, {new : true}, function (err, personUpdated) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!personUpdated) {
                            return callback(util.createErrorObject('PERSON_NOT_FOUND', 404), null);
                        }

                        var result = {
                            message: 'PERSON_UPDATED',
                            status: 200,
                            data: personUpdated
                        };

                        callback(null, result);
                    });

                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });

        });

module.exports = router;