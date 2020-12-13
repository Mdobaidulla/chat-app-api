
//Dependencies
const express = require('express');
let cors = require('cors')


// const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require('express-session')
const app = express ();
app.use(cors())

//-----Starts socket from here------
const http =require('http')
// const socketIO=require('socket.io')
let server=http.createServer(app)
// let io=socketIO(server)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
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
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project


//ALL CONTROLLERS
 const usersControllers = require('./controllers/usersControllers');
 const chatroomsController = require('./controllers/chatroomsController');
 const sessionsController = require('./controllers/sessions_controller');
 const chatsController = require('./controllers/chatsController');
 app.use('/users', usersControllers);
 app.use('/chatrooms', chatroomsController);
 app.use('/sessions', sessionsController)
 app.use('/chats', chatsController);

//SOCKET
io.on('connection', (socket)=>{
  console.log("A new user is just connected");
})

// ROUTES
app.get('/' , (req, res) => {
  res.send("The app is working")
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));

io.on('connection', socket => {
  console.log('New client connected')
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('text_message', (text_msg) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('text_message: ', text_msg)
    io.sockets.emit('text_message', text_msg)
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

//___________________
//Listener
//___________________
server.listen(PORT, () => console.log( 'Listening on port:', PORT));
