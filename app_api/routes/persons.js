var express = require('express');
var router = express.Router();
var Person = require('./../models/person');
var _ = require('lodash');
var util = require('../util/sharedFunctions');

router.route('/')
        .post(function (req, res) {
            var person = req.body;
            Person.create(person, function (err, personCreated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else {
                    var data = personCreated.toObject();
                    return util.util.sendResponse(res, 201, {
                        //Find a better way
                        data: _.omit(data, ['password']),
                        message: 'PERSON_CREATED',
                        error: false
                    });
                }
            });
        });

router.route('/:id')
        .get(function (req, res) {
            
            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID',
                    error: true
                });
            }

            Person.findById(req.params.id, function (err, person) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else if (!person) {
                    return util.sendResponse(res, 404, {
                        message: 'PERSON_NOT_FOUND',
                        error: true
                    });
                }

                return util.sendResponse(res, 200, {
                    data: person.toObject(),
                    message: 'PERSON_FOUND',
                    error: false
                });
            });

        })
        .put(function (req, res) {

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID',
                    error: true
                });
            }

            var query = {_id: req.params.id};
            var update = req.body;

            Person.findOneAndUpdate(query, update, {new : true}, function (err, personUpdated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else if (!personUpdated) {
                    return util.sendResponse(res, 500, {
                        message: 'PERSON_NOT_FOUND',
                        error: true
                    });
                }

                return util.sendResponse(res, 200, {
                    data: personUpdated.toObject(),
                    message: 'PERSON_UPDATED',
                    error: false
                });
            });

        });

module.exports = router;