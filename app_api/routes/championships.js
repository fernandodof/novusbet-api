var express = require('express');
var router = express.Router();
var Championship = require('../models/championship');
var Round = require('../models/round');
var util = require('../util/sharedFunctions');
var async = require('async');

router.route('/')
        .get(function (req, res) {
            Championship.find({})
                    .select('-rounds')
                    .exec(function (err, championships) {
                        if (err) {
                            return util.sendResponse(res, 500, {
                                message: 'COMMON_INTERNAL_ERROR'
                            });
                        } else if (!championships) {
                            return util.sendResponse(res, 404, {
                                message: 'CHAMPIONSHIPS_NOT_FOUND'
                            });
                        }

                        return util.sendResponse(res, 200, {
                            data: championships,
                            message: 'CHAMPIONSHIPS_FOUND'
                        });


                    });
        })
        .post(function (req, res) {
            var championship = req.body;

            Championship.create(championship, function (err, championshipCreated) {
                if (err) {
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else {
                    return util.sendResponse(res, 201, {
                        data: championshipCreated,
                        message: 'CHAMPIONSHIP_CREATED'
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
                }, function (id, callback) {

                    Championship.findById(id)
                            .populate('rounds')
                            .exec(function (err, championship) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!championship) {
                                    return callback(util.createErrorObject('CHAMPIONSHIP_NOT_FOUND', 404), null);
                                }

                                var result = {
                                    message: 'CHAMPIONSHIP_FOUND',
                                    status: 200,
                                    data: championship
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
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                function (id, callback) {

                    var query = {_id: id};
                    var update = req.body;

                    Championship.findOneAndUpdate(query, update, {new : true})
                            .select('-rounds')
                            .exec(function (err, championshipUpdated) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!championshipUpdated) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                }

                                var result = {
                                    message: 'CHAMPIONSHIP_UPDATED',
                                    status: 200,
                                    data: championshipUpdated
                                };

                                callback(null, result);
                            });
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });



        })
        .delete(function (req, res) {
            return res.status(200).json({message: 'TODO'});
        });

router.route('/:id/rounds')
        .post(function (req, res) {

            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                //find championship
                function (id, callback) {
                    Championship.findById(id, function (err, championship) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!championship) {
                            return callback(util.createErrorObject('CHAMPIONSHIP_NOT_FOUND', 404), null);
                        }

                        callback(null, championship);
                    });

                },
                //create round
                function (championship, callback) {
                    var newRound = new Round(req.body);
                    newRound.chmapionship = championship._id;
                    newRound.save(function (err, round) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        }

                        callback(null, championship, round);
                    });
                },
                //associate round and champioship
                function (championship, round, callback) {
                    championship.rounds.push(round._id);
                    championship.save(function (err) {

                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        }

                        var result = {
                            message: 'ROUND_CREATED',
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
        .get(function (req, res) {

            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                function (id, callback) {
                    //find chmapionship
                    Championship
                            .findById(id)
                            .populate('rounds')
                            .exec(function (err, championship) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!championship) {
                                    return callback(util.createErrorObject('CHAMPIONSHIP_NOT_FOUND', 404), null);
                                }

                                var result = {
                                    message: 'ROUND_FOUND',
                                    status: 200,
                                    data: championship.rounds
                                };

                                callback(null, result);
                            });
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });


        });

module.exports = router;