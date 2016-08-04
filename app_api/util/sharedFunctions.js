var mongoose = require('mongoose');

var sendResponse = function (res, status, content) {
    return res.status(status).json(content);
};


module.exports = {
    sendResponse: function (res, status, content) {
        return sendResponse(res, status, content);
    },
    sendResponseFromAsync: function (res, err, result) {
        if (err) {
            return sendResponse(res, err.status, {
                message: err.message
            });
        } else {
            return sendResponse(res, result.status, {
                message: result.message,
                data: result.data
            });
        }
    },
    validateObjectId: function (id) {
        return mongoose.Types.ObjectId.isValid(id);
    },
    createErrorObject: function (message, status){
        return {
            status: status || 500,
            message: message
        };
    }
};