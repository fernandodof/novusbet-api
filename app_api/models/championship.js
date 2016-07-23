var mongoose = require('mongoose');

var championshipSchema = new mongoose.Schema({
    name: {type: String, required: true},
    year: {type: Number, required: true},
    finished: {type:Boolean, default: false },
    numberOfTeams: {type: Number, default: 20}, 
    
    rounds: [{type: mongoose.Schema.Types.ObjectId, ref: 'rounds'}]
});

module.exports = mongoose.model('championship', championshipSchema);