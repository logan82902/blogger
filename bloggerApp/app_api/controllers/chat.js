var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


module.exports.chatGet = function (req, res) {
  Chat
    .find({})
    .exec() // Remove the callback function
    .then(function(chats) {
      sendJSONresponse(res, 200, chats);
    })
    .catch(function(err) {
      console.log(err);
      sendJSONresponse(res, 500, { "message": "Internal server error" });
    });
};

module.exports.chatPost = function (req, res) {
  Chat
    .create({
      chat: req.body.chat,
      name: req.body.name,
      email: req.body.email 
    })
    .then(function(chat) {
      console.log(chat);
      sendJSONresponse(res, 201, chat);
    })
    .catch(function(err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    });
};

// Implement the logic to delete chat messages in the controller
// chatDelete method
module.exports.chatDelete = function(req, res) {
  var chatId = req.params.chatId;
  var userEmail = req.params.email; // Assuming the user's email is stored in req.payload.email after authentication

  Chat.findByIdAndDelete(chatId)
    .then(function(chat) {
      if (!chat) {
        sendJSONresponse(res, 404, { "message": "Chat message not found" });
        return;
      }
      sendJSONresponse(res, 204, null);
    })
    .catch(function(err) {
      console.error(err);
      sendJSONresponse(res, 500, { "message": "Internal server error" });
    });
};