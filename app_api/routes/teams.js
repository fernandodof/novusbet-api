var express = require('express');
var router = express.Router();
var Team = require('../models/team');
var util = require('../util/sharedFunctions');
var async = require('async');

router.route('/')
        .get(function (req, res) {
            Team.find({active: true})
                    .select('-active')
                    .exec(function (err, teams) {
                        if (err) {
                            return util.sendResponse(res, 500, {
                                message: 'COMMON_INTERNAL_ERROR'
                            });
                        } else if (!teams) {
                            return util.sendResponse(res, 500, {
                                message: 'TEAMS_NOT_FOUND'
                            });
                        }

                        return util.sendResponse(res, 200, {
                            data: teams,
                            message: 'TEAMS_FOUND'
                        });


                    });
        })
        .post(function (req, res) {
            var team = req.body;

            Team.create(team, function (err, teamCreated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else {
                    return util.sendResponse(res, 201, {
                        data: teamCreated,
                        message: 'TEAM_CREATED'
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
                    Team.findById(id, function (err, team) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!team) {
                            return callback(util.createErrorObject('TEAM_NOT_FOUND', 404), null);
                        }

                        var result = {
                            message: 'TEAM_FOUND',
                            status: 200,
                            data: team
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

                    Team.findOneAndUpdate(query, update, {new : true}, function (err, teamUpdated) {
                        if (err) {
                            return callback(util.createErrorObject('COMMON_INTERNAL_ERROR'), null);
                        } else if (!teamUpdated) {
                            return callback(util.createErrorObject('TEAM_NOT_FOUND', 404), null);
                        }

                        var result = {
                            message: 'TEAM_UPDATED',
                            status: 200,
                            data: teamUpdated
                        };

                        callback(null, result);
                    });
                }
            ], function (err, result) {
                util.sendResponseFromAsync(res, err, result);
            });


        })
        .delete(function (req, res) {
            return res.status(200).json({sucess: true, message: 'TODO'});
        });

module.exports = router;