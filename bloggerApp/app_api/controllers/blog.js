var mongoose = require('mongoose');
var Blogs = mongoose.model('Blog');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogReadList = function (req, res) {
  Blogs
    .find({}, function(err, blogs) {
      if (err) {
        console.log(err);
        sendJSONresponse(res, 500, err);
        return;
      }
    sendJSONresponse(res, 200, blogs);
});
};

module.exports.blogReadOne = function (req, res) {
    console.log('Finding blog details', req.params);
    if (req.params && req.params.blogid) {
      Blogs
        .findById(req.params.blogid)
        .exec(function(err, blog) {
          if (!blog) {
                sendJSONresponse(res, 404, {
                "message": "blogid not found"
            });
            return;
          } else if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
          }
          console.log(blog);
          sendJSONresponse(res, 200, blog);
        });
    } else {
      console.log('No blogid specified');
      sendJSONresponse(res, 404, {
        "message": "No blogid in request"
      });
    }
};

module.exports.blogCreateOne = function (req, res) {
    console.log(req.body);
  Blogs
   .create({
      title: req.body.title,
      text: req.body.text
     }, function(err, blog) {
       if (err) {
          console.log(err);
          sendJSONresponse(res, 400, err);
       } else {
          console.log(location);
          sendJSONresponse(res, 201, blog);
       }
     }
   );
};
   
module.exports.blogUpdateOne = function (req, res) {
    console.log("Updating a blog entry with id of " + req.params.blogid);
    console.log(req.body);
    Blogs
  	  .findOneAndUpdate(
	     { _id: req.params.id },
 	     { $set: {"blogTitle": req.body.blogTitle, "blogEntry": req.body.blogEntry}},
	     function(err, response) {
	         if (err) {
	  	         sendJSONresponse(res, 400, err);
	         } else {
		        sendJSONresponse(res, 201, response);
	        }
	    }
    );
};

module.exports.blogDeleteOne = function (req, res) {
    console.log("Deleting blog entry with id of " + req.params.blogid);
    console.log(req.body);
    Blogs
        .findByIdAndRemove(req.params.blogid)
        .exec (
            function(err, response) {
                if (err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 204, response);
                }
            }
        );
};