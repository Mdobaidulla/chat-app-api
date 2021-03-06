const router = require('express').Router();
const { response } = require('express');
const Chatrooms= require('../models/chatrooms');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//INDEX ROUTE FOR CHATROOM
//This route will read all the chatrooms from chat-app-api database
router.get('/', async (req, res) => {
    console.log('Index Route');
    let allChatrooms = await Chatrooms.find({});
    res.send(allChatrooms);
  });

  router.get('/chatroomWithUserId/:id', async (req, res)=>{
    console.log('Index Route for chats in chatroom');
    let allChatrooms = await Chatrooms.find({});
    console.log(allChatrooms);

    let results = [];
    allChatrooms.forEach((chatroom, index) => {
        let flag = false;

        for (let i=0; i<chatroom["users"].length; i++) {
            if (chatroom["users"][i] == req.params.id) {
                flag = true;
            }
        }

        if (flag == true) {
            results.push(chatroom);
        }
    });
    res.send(results);
});

router.get('/getAllUsers/:id', async (req, res)=>{
    let allChatrooms = await Chatrooms.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allChatrooms.users);
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

 //UPDATE ROUTE FOR CHATROOM
//This route will delete a chatroom
router.put('/:id', async (req, res) =>{
    console.log(req.body);
    Chatrooms.findById(req.params.id, (err, foundChatroom) => {
        foundChatroom.users = req.body.users;
        foundChatroom.isActive = true;
        foundChatroom.save((err, foundDrivein) => {
          res.redirect(`/chatrooms/${req.params.id}`);
        });
      });
 });

//DELETE ROUTE FOR CHATROOM
//This route will delete a chatroom
 router.delete('/:id', async (req, res) =>{
    console.log(req.body);
     let chatroom = await Chatrooms.findByIdAndRemove(req.params.id)
     res.send(chatroom)
 });

 module.exports= router;