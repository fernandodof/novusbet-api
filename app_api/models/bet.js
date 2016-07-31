var mongoose = require('mongoose');

var betSchema = new mongoose.Schema({
    points : {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    
    gambler: {type: mongoose.Schema.Types.ObjectId, ref: 'person'},
    round: {type: mongoose.Schema.Types.ObjectId, ref: 'round'},
    guesses : [{type: mongoose.Schema.Types.ObjectId, ref: 'guess'}]
}, {versionKey: false});

betSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

betSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

module.exports = mongoose.model('bet', betSchema);