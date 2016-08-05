var express = require('express');
var router = express.Router();
var Round = require('../models/round');
var util = require('../util/sharedFunctions');
var async = require('async');

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
                    Round.findById(id)
                            .exec(function (err, round) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!round) {
                                    return callback(util.createErrorObject('ROUND_NOT_FOUND', 404), null);
                                }

                                var result = {
                                    message: 'ROUND_FOUND',
                                    status: 200,
                                    data: round
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

                    Round.findByIdAndUpdate(query, update, {new : true})
                            .exec(function (err, round) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!round) {
                                    return callback(util.createErrorObject('ROUND_NOT_FOUND', 404), null);
                                }

                                var result = {
                                    message: 'ROUND_UPDATED',
                                    status: 200,
                                    data: round
                                };

                                callback(null, result);
                            });

                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });
        });

module.exports = router;