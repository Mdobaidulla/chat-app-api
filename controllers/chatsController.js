const router = require('express').Router();
const { response } = require('express');
const Chats= require('../models/chats');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//INDEX ROUTE FOR CHAT
//This route will read all the chats from chat-app-api database
router.get('/', async (req, res) => {
    console.log('Index Route');
    let allChats = await Chats.find({});
    res.send(allChats);
  });

//SHOW ROUTE FOR CHATS IN CHATROOM
//This route will read the specified chat from chat-app-api database
router.get('/chatroom/:id', async (req, res)=>{
    console.log('Index Route for chats in chatroom');
    let allChats = await Chats.find({});
    console.log(allChats);

    let results = [];
    allChats.forEach((chat, index) => {
        if (chat["chatroom"] == req.params.id) {
            results.push(chat);
        }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(results);
});

//SHOW ROUTE FOR CHAT
//This route will read the specified chat from chat-app-api database
// router.get('/:id', async (req, res)=>{
//     let allChats = await Chats.findById(req.params.id,(err, response)=>{
//         if (err){ 
//             console.log(err); 
//         } 
//         else{ 
//             console.log("Result : ", response); 
//         } 
//     });
//     res.send(allChats);
// });

//NEW ROUTE FOR CHAT
//This route will add a new chat
router.post('/', async (req, res) =>{
    console.log(req.body);
     let chat = await Chats.create(req.body)
     res.send(chat)
 });

//DELETE ROUTE FOR CHAT
//This route will delete a chat
router.delete('/:id', async (req, res) =>{
    console.log(req.body);
     let chat = await Chats.findByIdAndRemove(req.params.id)
     res.send(chat)
 });

 module.exports= router;