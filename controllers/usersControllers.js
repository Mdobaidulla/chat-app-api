const router = require('express').Router();
const { response } = require('express');
const bcrypt = require('bcrypt')

const Users= require('../models/users');

// var http = require("http").Server(app);
// var io = require("socket.io")(http);

//*********Uploading image***********
let fs = require('fs'); 
let path = require('path'); 
let multer = require('multer'); 
let storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
let upload = multer({ storage: storage }); 
 //*******Fil Upload pre requisite ended here/

 router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//GET_ALL_USERS
//This route will read all the registered user from chat-app-api database
router.get('/', async (req, res)=>{
    let allUsers = await Users.find({});
    
    res.send(allUsers);
});


router.get('/first_name/:id', async (req, res)=>{
    let allUsers = await Users.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allUsers["first_name"]);
});

router.get('/last_name/:id', async (req, res)=>{
    let allUsers = await Users.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allUsers["last_name"]);
});

//GET_ONE_USER
router.get('/:id', async (req, res)=>{
    
    let allUsers;
    try{
        allUsers = await Users.findById(req.params.id,(err, respons)=>{
            if (err){  
                res.send("Error:", err);
            } 
            else{ 
                console.log("Result : ", respons); 
                res.send(allUsers);
            } 
        });
    }
    catch(e){
        console.log(e.getMessage());
    }
});

 //POST
//This route will add the a new user 
router.post('/',upload.single('image'), async (req, res) =>{
    //*************Image upload */
    // var img = fs.readFileSync(req.file.path);
    // var encode_image = img.toString('base64');
    // var finalImg = {
    //     contentType: req.file.mimetype,
    //     data:Buffer.from(encode_image, 'base64'), 
    //     path: req.file.path,
    //  };
    //  req.body.image=finalImg;
     req.body.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
     //**********image upload */
     let user = await Users.create(req.body)
      //**********The Uploaded file will be removed from Upload folder
    //after adding the binary image in database Image */
    // fs.unlink(req.file.path, (err) => {
    //     if (err) {
    //       console.error(err)
    //       return
    //     }
    //   console.log("The file is removed");
    //   })
     res.send(req.body)
 })


 module.exports= router;