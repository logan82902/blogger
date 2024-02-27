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

// Blog Add 
module.exports.add = function(req, res) {
  res.render('blogAdd', { title: 'Add Blog' });
};    

// GET 'blogAdd' page
module.exports.blogAdd = function(req, res){
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
              res.redirect('/blogList');
          }else{
            _handleError(req, res, response.statusCode);
          }
      }
  )
};

// Blog Edit
module.exports.edit = function(req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  }; 
  request(
    requestOptions,
    function(err, response, body) {
      renderBlogEdit(req, res, body);
    }
  );
};

var renderBlogEdit = function(req, res, responseBody){
  res.render('blogEdit', {title: 'Blog Edit', blog: responseBody});
};

// GET 'blogEdit' page
module.exports.blogEdit = function(req, res){
  var requestOptions, path, postJSON;
  path = "/api/blogs/" + req.params.blogid;

  postJSON = {
    title: req.body.title,
    text: req.body.text
  }

  requestOptions = {
      url: apiOptions.server + path,
      method: "PUT",
      json: postJSON
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/blogList');
      } else {
        _handleError(req, res, response.statusCode);
      }
    }
  );
};

// Blog Delete
module.exports.delete = function(req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(  
    requestOptions, 
      function(err, response, body) {
          renderBlogDeletion(req, res, body);
      }
  );
};

var renderBlogDeletion = function(req, res, responseBody) {
  res.render('blogDelete', { title: "Blog Deletion", blog: responseBody});
};

// GET 'blogDelete' page
module.exports.blogDelete = function (req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
      url: apiOptions.server + path,
      method: "DELETE",
      json: {}
  };
  request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 204) {
            res.redirect('/blogList');
        } else {
            _handleError(req, res, response.statusCode);
        }
    }
  );
};

// Error handling
var _handleError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Sorry, the page could not be found.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "There's a problem with our server, please try again later.";
  } else {
    title = status + ", something is wrong";
    content = "Something has gone wrong.";
  }
    res.status(status);
};