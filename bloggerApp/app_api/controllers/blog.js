var mongoose = require('mongoose');
var Blogs = mongoose.model('Blog');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogReadList = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.blogReadOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.blogCreateOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};
   
module.exports.blogUpdateOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.blogDeleteOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};