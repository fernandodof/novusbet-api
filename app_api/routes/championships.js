var express = require('express');
var router = express.Router();
var Championship = require('../models/championship');
var Round = require('../models/round');
var util = require('../util/sharedFunctions');
var _ = require('lodash');
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
                            return util.sendResponse(res, 500, {
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
                    console.log(err);
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

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID',
                    error: true
                });
            }

            Championship.findById(req.params.id)
                    .populate('rounds')
                    .exec(function (err, championship) {
                        if (err) {
                            console.log(err);
                            return util.sendResponse(res, 500, {
                                message: 'COMMON_INTERNAL_ERROR'
                            });
                        } else if (!championship) {
                            return util.sendResponse(res, 404, {
                                message: 'CHAMPIONSHIP_NOT_FOUND'
                            });
                        }

                        return util.sendResponse(res, 200, {
                            data: championship,
                            message: 'CHAMPIONSHIP_FOUND'
                        });


                    });

        })
        .put(function (req, res) {

            var errReturn = {status: 500};

            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        errReturn.message = 'INVALID_ID';
                        errReturn.status = 400;
                        return callback(errReturn, null);
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
                            console.log(err);
                            errReturn.message = 'COMMON_INTERNAL_ERROR';
                            return callback(errReturn, null);
                        } else if (!championshipUpdated) {
                            errReturn.message = 'CHAMPIONSHIP_NOT_FOUND';
                            return callback(errReturn, null);
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
                console.log(err, result);
                util.sendResponseFromAsync(res, err, result);
            });



        })
        .delete(function (req, res) {
            return res.status(200).json({message: 'TODO'});
        });

router.route('/:id/rounds')
        .post(function (req, res) {

            var errReturn = {status: 500};
            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        errReturn.message = 'INVALID_ID';
                        errReturn.status = 400;
                        return callback(errReturn, null);
                    }
                    callback(null, req.params.id);
                },
                //find championship
                function (id, callback) {
                    Championship.findById(id, function (err, championship) {
                        if (err) {
                            console.log(err);
                            errReturn.message = 'COMMON_INTERNAL_ERROR';
                            return callback(errReturn, null);
                        } else if (!championship) {
                            errReturn.message = 'CHAMPIONSHIP_NOT_FOUND';
                            return callback(errReturn, null);
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
                            errReturn.message = 'COMMON_INTERNAL_ERROR';
                            return callback(errReturn, null);
                        }

                        callback(null, championship, round);
                    });
                },
                //associate round and champioship
                function (championship, round, callback) {
                    championship.rounds.push(round._id);
                    championship.save(function (err) {

                        if (err) {
                            errReturn.message = 'COMMON_INTERNAL_ERROR';
                            return callback(errReturn, null);
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
                console.log(err, result);
                util.sendResponseFromAsync(res, err, result);
            });

        })
        .get(function (req, res) {
            var errReturn = {status: 500};

            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        errReturn.message = 'INVALID_ID';
                        errReturn.status = 400;
                        return callback(errReturn, null);
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
                                    console.log(err);
                                    errReturn.message = 'COMMON_INTERNAL_ERROR';
                                    return callback(errReturn, null);
                                } else if (!championship) {
                                    errReturn.message = 'CHAMPIONSHIP_NOT_FOUND';
                                    return callback(errReturn, null);
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
                console.log(err, result);
                util.sendResponseFromAsync(res, err, result);
            });


        });

module.exports = router;