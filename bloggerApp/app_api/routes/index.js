var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

// Blogs
router.get('/blogs', ctrlBlog.blogReadList);
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
router.post('/blogs', ctrlBlog.blogCreateOne);
router.put('/blogs/:blogid', ctrlBlog.blogUpdateOne);
router.delete('/blogs/:blogid', ctrlBlog.blogDeleteOne);

module.exports = router;