var mongoose = require('mongoose');

module.exports = {
    sendResponse: function (res, status, content) {
        return res.status(status).json(content);
    },
    validateObjectId: function (id){
        return mongoose.Types.ObjectId.isValid(id);
    }
};