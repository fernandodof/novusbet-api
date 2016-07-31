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

            if (!util.validateObjectId(req.params.id)) {
                return util.sendResponse(res, 500, {
                    message: 'INVALID_ID'
                });
            }

            Team.findById(req.params.id, function (err, team) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else if (!team) {
                    return util.sendResponse(res, 404, {
                        message: 'TEAM_NOT_FOUND'
                    });
                }

                return util.sendResponse(res, 200, {
                    data: team,
                    message: 'TEAM_FOUND'
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

            Team.findOneAndUpdate(query, update, {new : true}, function (err, teamUpdate) {
                if (err) {
                    console.log(err);
                    return util.sendResponse(res, 500, {
                        message: 'COMMON_INTERNAL_ERROR'
                    });
                } else if (!teamUpdate) {
                    return util.sendResponse(res, 500, {
                        message: 'TEAM_NOT_FOUND'
                    });
                }

                return util.sendResponse(res, 200, {
                    data: teamUpdate,
                    message: 'TEAM_UPDATED'
                });
            });

        })
        .delete(function (req, res) {
            return res.status(200).json({sucess: true, message: 'TODO'});
        });

module.exports = router;