var express = require('express');
var router = express.Router();
var Person = require('./../models/person');

var sendResponse = function (res, status, content) {
    return res.status(status).json(content);
};

router.route('/')
        .post(function (req, res) {
            var person = req.body;
            Person.create(person, function (err, personSaved) {
                if (err) {
                    console.log(err);
                    return sendResponse(res, 404, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else {
                    return sendResponse(res, 201, {
                        data: personSaved,
                        message: 'PERSON_SAVED',
                        error: false
                    });
                }
            });
        });

router.route('/:id')
        .get(function (req, res) {
            if (req.params && req.params.id) {
                Person.findById(req.params.id)
                        .exec(function (err, person) {
                            if (err) {
                                console.log(err);
                                return sendResponse(res, 404, {
                                    message: 'COMMON_INTERNAL_ERROR',
                                    error: true
                                });
                            } else if (!person) {
                                return sendResponse(res, 404, {
                                    message: 'PERSON_NOT_FOUND',
                                    error: true
                                });
                            }

                            return sendResponse(res, 200, {
                                data: person,
                                message: 'PERSON_FOUND',
                                error: false
                            });
                        });
            }
        })
        .put(function (req, res) {
            if (!req.params.id) {
                return sendResponse(res, 404, {
                    message: 'PERSON_ID_REQUIRED',
                    error: true
                });
            }

            var person = req.body;

            Person.findByIdAndUpdate(req.params.id, person, {new : true}, function (err, personUpdated) {
                if (err) {
                    console.log(err);
                    return sendResponse(res, 404, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else if (!personUpdated) {
                    return sendResponse(res, 404, {
                        message: 'PERSON_NOT_UPDATED',
                        error: true
                    });
                }

                return sendResponse(res, 200, {
                    data: personUpdated,
                    message: 'PERSON_UPDATED',
                    error: false
                });
            });

        });

module.exports = router;