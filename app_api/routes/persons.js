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
            
            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID'
                });
            }

            Person.findById(req.params.id, function (err, person) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else if (!person) {
                    return util.sendResponse(res, 404, {
                        message: 'PERSON_NOT_FOUND'
                    });
                }

                return util.sendResponse(res, 200, {
                    data: person,
                    message: 'PERSON_FOUND'
                });
            });

        })
        .put(function (req, res) {

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID'
                });
            }

            var query = {_id: req.params.id};
            var update = req.body;

            Person.findOneAndUpdate(query, update, {new : true}, function (err, personUpdated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else if (!personUpdated) {
                    return util.sendResponse(res, 500, {
                        message: 'PERSON_NOT_FOUND'
                    });
                }

                return util.sendResponse(res, 200, {
                    data: personUpdated,
                    message: 'PERSON_UPDATED'
                });
            });

        });

module.exports = router;