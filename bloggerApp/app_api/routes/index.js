var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
var ctrlBlog = require('../controllers/blog');
const ctrlAuth = require('../controllers/authenticate');

console.log("JWT_SECRET:", process.env.JWT_SECRET); // Logging JWT_SECRET

var auth = function(req, res, next) {
  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

// Blogs
router.get('/blogs', ctrlBlog.blogReadList);
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
router.post('/blogs', auth, ctrlBlog.blogCreateOne);
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne);
router.delete('/blogs/:blogid', auth, ctrlBlog.blogDeleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;