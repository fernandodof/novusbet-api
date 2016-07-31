var mongoose = require('mongoose');

var championshipSchema = new mongoose.Schema({
    name: {type: String, required: true},
    year: {type: Number, required: true},
    finished: {type:Boolean, default: false },
    numberOfTeams: {type: Number, default: 20}, 
    
    rounds: [{type: mongoose.Schema.Types.ObjectId, ref: 'round'}]
}, {versionKey: false});

championshipSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

championshipSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

module.exports = mongoose.model('championship', championshipSchema);