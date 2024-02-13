var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogEntry: String,
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('Blog', blogSchema);