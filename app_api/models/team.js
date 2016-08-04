var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    active: {type: Boolean, default: true}
}, {versionKey: false});

teamSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

teamSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

module.exports = mongoose.model('team', teamSchema);