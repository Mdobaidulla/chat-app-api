const mongoose = require('mongoose');
const chatsSchema = new mongoose.Schema({
    chatsroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatrooms',
    },
    chat_message_id: {
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