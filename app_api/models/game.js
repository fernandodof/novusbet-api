var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
    local: {type: String, required: true},
    data: {type: Date, required: true},
    scoreTeam1: {type: Number, default: 0},
    scoreTeam2: {type: Number, default: 0},
    
    team1: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    team2: {type: mongoose.Schema.Types.ObjectId, ref: 'team'}
});

module.exports = mongoose.model('game', gameSchema);