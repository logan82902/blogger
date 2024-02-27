// app_server-controllers/blog.js
var request = require('request');
var apiOptions = {
    server : "http://54.173.57.226"
  };

var renderBloglist = function(req, res, responseBody) {
  res.render('blogList', { title: 'Blog List', blogs: responseBody });
}

// GET 'blogList' page
module.exports.blogList = function (req, res) {
  var requestOptions, path;
  path = "/api/blogs";
  requestOptions = {
      url : apiOptions.server + path,
      method : "GET",
      json : {}
  };
  request(
      requestOptions,
      function(err, response, body) {
        renderBloglist(req, res, body);
        if (err) {
          console.error("Error in API request:", err);
          res.status(500).render('error', { error: "Internal Server Error" });
          return;
        }
        
      }
  );
};

// GET 'blogAdd' page
module.exports.blogAdd = function(req, res){
  res.render('blogAdd', { title: 'Blog Add' });
  var requestOptions, path, postData;
  path = "/api/blogs";
  postData = {
      title: req.body.title,
      text: req.body.text
  };
  requestOptions = {
      url: apiOptions.server + path,
      method: "POST",
      json: postData
  };
  request(
      requestOptions,
      function(err, response, body) {
          if(response.statusCode == 201){
              res.renderBloglist('/blogList');
          }
      }
  )
};

var renderBlogEdit = function(req, res, responseBody){
  res.render('blogEdit', { title: 'Blog Edit', blog: responseBody });
};


// GET 'blogEdit' page
module.exports.blogEdit = function(req, res){
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
      url: apiOptions.server + path,
      method: "GET",
      json: {}
  };
  request(
      requestOptions,
      function(err, response, body) {
          renderBlogEdit(req, res, body);
      }
  );
};

var renderBlogDeletion = function(req, res) {
  res.render('blogDelete', { title: "Blog Deletion", blogid: req.params.blogid});
};

// GET 'blogDelete' page
module.exports.blogDelete = function (req, res) {
  renderBlogDeletion(req, res);

  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
      url: apiOptions.server + path,
      method: "DELETE",
      json: {}
  };
  request(
      requestOptions
  );
};