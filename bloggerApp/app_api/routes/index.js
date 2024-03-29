var express = require('express');
var router = express.Router();
require('dotenv').config();
var ctrlBlog = require('../controllers/blog');
const ctrlAuth = require('../controllers/authenticate');
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

// Blogs
router.get('/blogs', ctrlBlog.blogReadList);
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
router.post('/blogs', auth, ctrlBlog.blogCreateOne);
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne);
router.delete('/blogs/:blogid', auth, ctrlBlog.blogDeleteOne);

// Authorization
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;