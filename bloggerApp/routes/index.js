var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET pages. */
router.get('/', ctrlHome.home);
router.get('/blog', ctrlBlog.blog);

module.exports = router;
