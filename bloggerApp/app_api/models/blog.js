var mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    userEmail: {
      type: String
    },
    userName: {
      type: String
    }
});

mongoose.model('Blog', blogSchema);