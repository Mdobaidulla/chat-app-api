const mongoose = require('mongoose');
const chatsSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatrooms',
    },
    chat_id: {
        type: String,
        required: true, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    message: {
        type: String,
    }
   },
   {
       timestamps: true
   });

   
module.exports = mongoose.model("Chats", chatsSchema);