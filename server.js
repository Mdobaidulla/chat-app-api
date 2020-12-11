
//Dependencies
const express = require('express');
let cors = require('cors')


// const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require('express-session')
const app = express ();


//-----Starts socket from here------
const http =require('http')
const socketIO=require('socket.io')
let server=http.createServer(app)
let io=socketIO(server)
//----socket works until here----



const db = mongoose.connection;
//Port
const PORT = process.env.PORT || 5000;


//Database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'+ 'chat-app-api';
mongoose.connect(MONGODB_URI ,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });


// Error / success messages
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on('open' , ()=>{});

//use public folder for static assets
app.use(express.static('public'));
app.use(cors())
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project


//ALL CONTROLLERS
 const usersControllers = require('./controllers/usersControllers');
 const chatroomsController = require('./controllers/chatroomsController');
 app.use('/users', usersControllers);
 app.use('/chatrooms', chatroomsController);

//SOCKET
io.on('connection', (socket)=>{
  console.log("A new user is just connected");
})

// ROUTES
app.get('/' , (req, res) => {
  res.send("The app is working")
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));

