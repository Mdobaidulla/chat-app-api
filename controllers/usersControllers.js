const router = require('express').Router();
const { response } = require('express');
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')

const Users= require('../models/users');

// var http = require("http").Server(app);
// var io = require("socket.io")(http);

//*********Uploading image***********
let fs = require('fs'); 
let path = require('path'); 
let multer = require('multer'); 
const { CLIENT_RENEG_WINDOW } = require('tls');
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

router.get('/email/:id', async (req, res)=>{
    let allUsers = await Users.findById(req.params.id,(err, response)=>{
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", response); 
        } 
    });
    res.send(allUsers["email"]);
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
    if (req.params.id == '') {
        let allUsers;
        try {
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
    }
});


//POST for creating a new account
router.post('/', async(req, res) => {
    console.log(process.env.BASE_URL);
    let securityCode= Math.floor(100000 + Math.random() * 900000);
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      req.body.security=securityCode;
     let user=await Users.create(req.body, (error, createdUser) => {
        if(error){
          console.log(error);
        }
        //adding this for sending email
        const url=`${process.env.BASE_URL}/users/${securityCode}/verify/${req.body.email}`;

        let logo='https://res.cloudinary.com/dpggpg7su/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1608172807/logo_aegy9a.png'
        let message="<div style='background:#f58002;color:#FFFFFF;display:flex;'><img style='width:12vh;' src="+logo+"><center><h1>Pru Full-stack Developers</h1></center></div><br>Dear "+req.body.first_name+" "+req.body.last_name+",<br> <b>Do't click on the link if you are not expecting the verification</b>.<br> To verify <a href="+url+">Click</a> here and complete the registration<br> You can copy and past the link on your browser "+url;
      
        //Seding email to verify 
        sendEmail(req.body.email,message);
        res.send("Success");
      })
  })

 //PUT
 /**
  * This is the method that we use to complete the email verification 
  * This get call will be executed on broser when the user will click on the link
  * 
  */
 router.get('/:id/verify/:uniqueid', async(req, res)=>{
    let securityCode= Math.floor(100000 + Math.random() * 900000);
  let oneUser = await Users.findOne({email:req.params.uniqueid});
  console.log(oneUser);
   if(oneUser && req.params.id==oneUser.security){
    let user =await Users.findByIdAndUpdate({_id:oneUser.id},
        {
            isActive :true,
            security:securityCode  
        },
        (error, updated)=>{
         if(error){
             res.send("<p> Your code is not valid</p>")
         }else{
             const home_page='http://localhost:3000';
              let logo='https://res.cloudinary.com/dpggpg7su/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1608172807/logo_aegy9a.png'
                    let message="<div style='background:#f58002;color:#FFFFFF;display:flex;justify-content:space-between;'><img style='width:10vh;' src="+logo+"><center><h1>Pru Full-stack Developers</h1></center></div>";
             res.send(message+"<p>You have successfully verified your email </p><a href='"+home_page+"'>click</a> here for login")
         }
     })
    }
 })




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

  /**
   * Helping method
   * 
   */
const sendEmail = (receiver_email,message) =>{
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_SMTP_USER,
            pass: process.env.GMAIL_SMTP_PASSWORD
        }
    });
    let mailOptions = {
        // should be replaced with real recipient's account
      to: receiver_email,
      subject: "Pru Full-stack Developers",
      html: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }else{
        console.log('Message %s sent: %s', info.messageId, info.response);
        }
    });
}
 module.exports= router;