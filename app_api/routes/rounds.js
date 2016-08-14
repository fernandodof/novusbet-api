var express = require('express');
var router = express.Router();
var Round = require('../models/round');
var Game = require('../models/game');
var Bet = require('../models/bet');
var Guess = require('../models/guess');
var util = require('../util/sharedFunctions');
var async = require('async');
var _ = require('lodash');
var Promise = require('bluebird');

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

router.route('/:id/bets')
        .post(function (req, res) {
            var newGuesses = req.body;
            //newGuesses = _.toArray(newGuesses.guesses);

            async.waterfall([
                //check id validity
                function (callback) {
                    if (!util.validateObjectId(req.params.id)) {
                        return callback(util.createErrorObject('INVALID_ID', 400), null);
                    }
                    callback(null, req.params.id);
                },
                //count number of guesses
                function (id, callback) {
                    if (newGuesses.guesses.length !== 10) {
                        return callback(util.createErrorObject('INVALID_GUESSES_AMOUNT_EXPECTED_10', 400), null);
                    }

                    callback(null, id, newGuesses);
                },
                //check if games ids exists and are different
                function (id, newGuesses, callback) {
                    checkIds(newGuesses.guesses).then(function (response) {
                        //insert all guesses
                        Guess.collection.insert(newGuesses.guesses, function (err, guesses) {
                            if (err) {
                                return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                            }
                            callback(null, id, guesses);
                        });

                    }, function (error) {
                        return callback(util.createErrorObject('INVALID_GAMES_AMOUNT_EXPECTED_10'), null);
                    });
                },
                //associate bet and guesses
                function (id, guessesInserted, callback) {
                    var newBet = new Bet();
                    newBet.gambler = newGuesses.gambler;
                    newBet.round = id;
                    newBet.guesses = guessesInserted.insertedIds;

                    newBet.save(function (err, bet) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        }

                        callback(null, bet.id);

                    });
                },
                //get id bet and return
                function (betId, callback) {
                    Bet.findById(betId)
                            .populate('guesses')
                            .exec(function (err, bet) {

                                if (err) {
                                    return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                                }

                                var result = {
                                    message: 'GUESSES_CREATED',
                                    status: 200,
                                    data: bet
                                };

                                callback(null, result);
                            });
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });
        });

var checkIds = function (guesses) {

    var ids = guesses.map(function (guess) {
        return guess.game;
    });

    var ids = _.uniq(ids);

    return new Promise(function (resolve, reject) {

        Game.count({'_id': {$in: ids}}, function (err, count) {
            if (err || count !== 10) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = router;