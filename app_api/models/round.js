var mongoose = require('mongoose');

var roundSchema = new mongoose.Schema({
    startDate: {type: Date, required: true },
    endDate: {type: Date, required: true},
    finished: {type: Boolean, default: false},
    available: {type: Boolean, default: false},

    championship: {type: mongoose.Schema.Types.ObjectId, ref: 'championship'},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
    bets: [{type: mongoose.Schema.Types.ObjectId, ref: 'bets'}]
}, {versionKey: false});

module.exports = mongoose.model('round', roundSchema);