var mongoose = require('mongoose');
var Blogs = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
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
  if (!req.params.blogid) {
    sendJSONresponse(res, 404, {"message": "Not found, blogid is required"});
    return;
  }

  Blogs
    .findById(req.params.blogid)
    .exec(function (err, blog) {
        if (!blog) {
            sendJSONresponse(res, 404, {"message": "blogid not found"});
            return;
        } else if (err) {
            sendJSONresponse(res, 400, err);
            return;
        }
        blog.title = req.body.title || blog.title;
        blog.text = req.body.text || blog.text;
        blog.createdOn = req.body.createdOn || blog.createdOn || new Date();
        blog.save(function (err, blog) {
            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                sendJSONresponse(res, 200, blog);
            }
        });
    });
};

module.exports.blogDeleteOne = function (req, res) {
  var blogid = req.params.blogid;
  if (blogid) {
    Blogs
      .findByIdAndRemove(req.params.blogid)
      .exec(
        function(err, blog) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Blog id " + req.params.blogid + " deleted");
          sendJSONresponse(res, 204, blog);
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No blogid"
    });
  }
};