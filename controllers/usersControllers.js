const router = require('express').Router();
const { response } = require('express');
const Users= require('../models/users');
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



//GET_ALL_USERS
//This route will read all the registered user from chat-app-api database
router.get('/', async (req, res)=>{
    let allUsers = await Users.find({});
    res.send(allUsers);
})

//GET_ONE_USER
router.get('/:id', async (req, res)=>{
 try{
    let allUsers = await Users.findById(req.params.id,(err, respons)=>{
        if (err){  
            res.send("Error:", err);
        } 
        else{ 
            console.log("Result : ", respons); 
            res.send(allUsers);
        } 
    });
}catch(e){
    console.log(e.getMessage());
}
});

 //POST
//This route will add the a new user 
router.post('/',upload.single('image'), async (req, res) =>{
    //*************Image upload */
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
        contentType: req.file.mimetype,
        data:Buffer.from(encode_image, 'base64'), 
        path: req.file.path,
     };
     req.body.image=finalImg;
     //**********image upload */
     let user = await Users.create(req.body)
      //**********The Uploaded file will be removed from Upload folder
    //after adding the binary image in database Image */
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      console.log("The file is removed");
      })
     res.send(req.body)

 });

 module.exports= router;