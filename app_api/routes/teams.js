var express = require('express');
var router = express.Router();
var Team = require('../models/team');
var util = require('../util/sharedFunctions');

router.route('/')
        .get(function (req, res) {
            Team.find({active: true})
                    .select('-active')
                    .exec(function (err, teams) {
                        if (err) {
                            return util.sendResponse(res, 500, {
                                message: 'COMMON_INTERNAL_ERROR',
                                error: true
                            });
                        } else {
                            if (teams) {
                                return util.sendResponse(res, 500, {
                                    data: teams.toObject(),
                                    message: 'TEAMS_FOUND',
                                    error: false
                                });
                            } else {
                                return util.sendResponse(res, 500, {
                                    message: 'TEAMS_NOT_FOUND',
                                    error: true
                                });
                            }
                        }
                    });
        })
        .post(function (req, res, next) {
            var team = req.body;

            Team.create(team, function (err, teamCreated) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else {
                    return util.sendResponse(res, 201, {
                        data: teamCreated.toJSON(),
                        message: 'TEAM_CREATED',
                        error: false
                    });
                }
            });
        });

router.route('/:id')
        .get(function (req, res, next) {

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID',
                    error: true
                });
            }

            Team.findById(req.params.id, function (err, team) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else if (!team) {
                    return util.sendResponse(res, 404, {
                        message: 'TEAM_NOT_FOUND',
                        error: true
                    });
                }
                
                return util.sendResponse(res, 200, {
                    data: team.toObject(),
                    message: 'TEAM_FOUND',
                    error: false
                });


            });

        })
        .put(function (req, res, next) {

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID',
                    error: true
                });
            }

            var query = {_id: req.params.id};
            var update = req.body;

            Team.findOneAndUpdate(query, update, {new : true}, function (err, teamUpdate) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR',
                        error: true
                    });
                } else if (!teamUpdate) {
                    return util.sendResponse(res, 500, {
                        message: 'TEAM_NOT_FOUND',
                        error: true
                    });
                }

                return util.sendResponse(res, 200, {
                    data: teamUpdate.toObject(),
                    message: 'TEAM_UPDATED',
                    error: false
                });
            });
            
        })
        .delete(function (req, res, next) {
            return res.status(200).json({sucess: true, message: 'TODO'});
        });

module.exports = router;