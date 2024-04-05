var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var capitalizeFirstLetter = function(string) {
  return string.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
};

module.exports.register = function(req, res) {
  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();

  user.name = capitalizeFirstLetter(req.body.name); // Capitalize username
  
  // Convert email to lowercase before storing
  user.email = req.body.email.toLowerCase();

  user.setPassword(req.body.password);

  user.save() 
    .then(() => {
      // Log in the user after registration
      req.body.email = req.body.email; 
      req.body.password = req.body.password;
      module.exports.login(req, res); 
    })
    .catch(err => {
      sendJSONresponse(res, 404, err);
    });
};

module.exports.login = function(req, res) {
  console.log("Login request received:", req.body.email); 

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  // Convert email to lowercase
  req.body.email = req.body.email.toLowerCase();

  passport.authenticate('local', function(err, user, info) {
    console.log("Passport authentication result:", err, user, info);
    var token;

    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }

    if (user) {
      user.generateJwt()
        .then(token => {
          sendJSONresponse(res, 200, {
            "token": token
          });
        })
        .catch(err => {
          sendJSONresponse(res, 500, err);
        });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};
