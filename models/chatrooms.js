const mongoose = require('mongoose');
const chatroomsSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        required: true, 
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    isActive:{
        type: Boolean,
        default: false,
    }
   },
   {
       timestamps: true
   });

   
module.exports = mongoose.model("Chatrooms", chatroomsSchema);