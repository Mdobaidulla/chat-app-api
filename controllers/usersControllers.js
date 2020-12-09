const router = require('express').Router();
const { response } = require('express');
const Users= require('../models/users');

//GET_ALL_USERS
//This route will read all the registered user from chat-app-api database
router.get('/', async (req, res)=>{
    let allUsers = await Users.find({});
    res.send(allUsers);
})

//GET_ONE_USER
router.get('/:id', async (req, res)=>{
    let allUsers = await Users.findById(req.params.id,(err, respons)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", respons); 
        } 
    });
    res.send(allUsers);
})


 //POST
//This route will add the a new user 
router.post('/', async (req, res) =>{
    console.log(req.body);
     let user = await Users.create(req.body)
     res.send(user)
     
 })

 module.exports= router;