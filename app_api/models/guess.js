var mongoose = require('mongoose');

var guessSchema = new mongoose.Schema({
    scoreTeam1: {type: Number, required: true},
    scoreTeam2: {type: Number, required: true},
    
    game: {type: mongoose.Schema.Types.ObjectId, ref: 'game' }
}, {versionKey: false});

guessSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

guessSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

module.exports = mongoose.model('guess', guessSchema);