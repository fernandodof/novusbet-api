var mongoose = require('mongoose');

var guessSchema = new mongoose.Schema({
    scoreTeam1: {type: Number, required: true},
    scoreTeam2: {type: Number, required: true},
    
    game: {type: mongoose.Schema.Types.ObjectId, ref: 'game' }
});

module.exports = mongoose.model('guess', guessSchema);