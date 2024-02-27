// app_server-controllers/blog.js
var request = require('request');
var apiOptions = {
    server : "http://54.173.57.226/"
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
        if (err) {
          console.error("Error in API request:", err);
          res.status(500).render('error', { error: "Internal Server Error" });
          return;
        }
          renderBloglist(req, res, body);
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

module.exports.blogDelete = function (req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.id; 
  requestOptions = {
      url: apiOptions.server + path,
      method: "DELETE",
      json: {}
  };
  request(
      requestOptions,
      function (err, response, body) {
          if (response.statusCode === 204) {
              res.redirect('/blogList');
          } else {
              res.status(response.statusCode).send(body);
          }
      }
  );
    };