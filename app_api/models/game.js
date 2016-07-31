var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
    local: {type: String, required: true},
    data: {type: Date, required: true},
    scoreTeam1: {type: Number, default: 0},
    scoreTeam2: {type: Number, default: 0},
    
    team1: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    team2: {type: mongoose.Schema.Types.ObjectId, ref: 'team'}
}, {versionKey: false});

gameSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

gameSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

module.exports = mongoose.model('game', gameSchema);