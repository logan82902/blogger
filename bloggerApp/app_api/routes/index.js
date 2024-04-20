var express = require('express');
var router = express.Router();
require('dotenv').config();
const ctrlBlog = require('../controllers/blog');
const ctrlAuth = require('../controllers/authenticate');
const ctrlChat = require('../controllers/chat');

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

// Chat
router.get('/chat', ctrlChat.chatGet);
router.post('/chat', ctrlChat.chatPost);
router.delete('/chat/:chatId', ctrlChat.chatDelete);

module.exports = router;