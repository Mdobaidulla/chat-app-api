const router = require('express').Router();
const { response } = require('express');
const Chats= require('../models/chats');

//INDEX ROUTE FOR CHAT
//This route will read all the chats from chat-app-api database
router.get('/', async (req, res) => {
    console.log('Index Route');
    let allChats = await Chats.find({});
    res.send(allChats);
  });

//SHOW ROUTE FOR CHAT
//This route will read the specified chat from chat-app-api database
router.get('/:id', async (req, res)=>{
    let allChats = await Chats.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allChats);
})

//NEW ROUTE FOR CHAT
//This route will add a new chat
router.post('/new', async (req, res) =>{
    console.log(req.body);
     let chat = await Chats.create(req.body)
     res.send(chat)
 })

 module.exports= router;