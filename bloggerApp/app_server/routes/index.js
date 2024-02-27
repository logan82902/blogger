var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET pages. */
router.get('/', ctrlHome.home);
router.get('/blogAdd', ctrlBlog.blogAdd);
router.get('/blogList', ctrlBlog.blogList);
router.get('/blogEdit/:blogid', ctrlBlog.blogEdit);
router.get('/blogDelete/:blogid', ctrlBlog.blogDelete);

module.exports = router;
