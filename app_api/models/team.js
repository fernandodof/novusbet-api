var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('time', teamSchema);