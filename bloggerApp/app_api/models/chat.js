var mongoose = require( 'mongoose' );

var chatSchema = new mongoose.Schema({ 
	chat: String,
	name: String,
	email: String
});

mongoose.model('Chat', chatSchema);