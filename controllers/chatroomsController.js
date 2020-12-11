const router = require('express').Router();
const { response } = require('express');
const Chatrooms= require('../models/chatrooms');

//INDEX ROUTE FOR CHATROOM
//This route will read all the chatrooms from chat-app-api database
router.get('/', async (req, res) => {
    console.log('Index Route');
    let allChatrooms = await Chatrooms.find({});
    res.send(allChatrooms);
  });

//SHOW ROUTE FOR CHATROOM
//This route will read the specified chatroom from chat-app-api database
router.get('/:id', async (req, res)=>{
    let allChatrooms = await Chatrooms.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allChatrooms);
});

//NEW ROUTE FOR CHATROOM
//This route will add a new chatroom
router.post('/', async (req, res) =>{
    console.log(req.body);
     let chatroom = await Chatrooms.create(req.body)
     res.send(chatroom)
 });

//DELETE ROUTE FOR CHATROOM
//This route will delete a chatroom
 router.delete('/:id', async (req, res) =>{
    console.log(req.body);
     let chatroom = await Chatrooms.findByIdAndRemove(req.params.id)
     res.send(chatroom)
 });

 module.exports= router;