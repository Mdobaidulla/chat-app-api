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

router.get('/userIdByEmail/:id', async (req, res)=>{
    let allUsers = await Users.find({});

    let targetId = '';
    allUsers.forEach((user) => {
        if (user['email'] == req.params.id) {
            targetId = user['_id'];
        }
    });
    res.send(targetId);
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

 //PUT
 //This route will Allow user to update their profile
 router.put('/:userId', async (req, res) => {
    let user =await Users.findByIdAndUpdate({_id:req.params.userId},
       {
           first_name:req.body.first_name,
           last_name:req.body.last_name,
           email:req.body.email,
       },
       (error, updated)=>{
        if(error){
            console.log(error);
        }else{
            console.log(updated);
        }
    })
    res.send(user);
  });


 module.exports= router;