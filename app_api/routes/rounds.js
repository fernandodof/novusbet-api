var express = require('express');
var router = express.Router();
var Round = require('../models/round');
var Game = require('../models/game');
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

router.route('/:id/games')
        .get(function (req, res) {
            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                //find round
                function (id, callback) {
                    Round.findById(id)
                            .populate('games')
                            .exec(function (err, round) {
                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                } else if (!round) {
                                    return callback(util.createErrorObject('ROUND_NOT_FOUND', 404), null);
                                }

                                var result = {
                                    message: 'GAMES_FOUND',
                                    status: 200,
                                    data: round.games
                                };

                                callback(null, result);
                            });
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });
        })
        .post(function (req, res) {
            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                //find round
                function (id, callback) {
                    Round.findById(id, function (err, round) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!round) {
                            return callback(util.createErrorObject('ROUND_NOT_FOUND', 404), null);
                        }
                        callback(null, round);
                    });
                },
                //create championship
                function (round, callback) {
                    var newGame = new Game(req.body);
                    newGame.save(function (err, game) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        }

                        callback(null, round, game);
                    });
                },
                //Associate round and game
                function (round, game, callback) {
                    round.games.push(game._id);

                    round.save(function (err) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        }

                        var result = {
                            message: 'GAME_CREATED',
                            status: 200,
                            data: game
                        };

                        callback(null, result);
                    });

                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });

        });

router.route('/:id/apostas')
        .post(function (req, res) {
            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                function (id){
                    var newGuesses = req.body;
                    if(newGuesses.lenght !== 10){
                        return callback(util.createErrorObject('INVALID_GUESSES_AMOUNT_EXPECTED_10', 400), null);
                    }
                    
                    callback(id, newGuesses);
                },
                function (id, newGuesses){
                    //TO BE CONTINUED
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });
        });

module.exports = router;