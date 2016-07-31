var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var dbURI = require('../config/values').dbUri;

autoIncrement.initialize(mongoose.createConnection(dbURI));

var roundSchema = new mongoose.Schema({
    startDate: {type: Date, required: true },
    endDate: {type: Date, required: true},
    finished: {type: Boolean, default: false},
    available: {type: Boolean, default: false},

    championship: {type: mongoose.Schema.Types.ObjectId, ref: 'championship'},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
    bets: [{type: mongoose.Schema.Types.ObjectId, ref: 'bets'}]
}, {versionKey: false});

roundSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

roundSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

roundSchema.plugin(autoIncrement.plugin, {
    model: 'round',
    field: 'number',
    startAt: 1
});


module.exports = mongoose.model('round', roundSchema);