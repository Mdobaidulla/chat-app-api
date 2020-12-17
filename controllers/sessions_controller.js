const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/users.js')
let currentUser;
router.get('/new', (req, res) => {
  //currentUser=req.session;
  res.send(currentUser)
});

// on sessions form submit (log in)
router.post('/', async(req, res) => {
  await User.findOne({ email: req.body.email }, (err, foundUser) => {
    console.log(foundUser);
    if (err) {
      console.log(err)
      res.send('oops the db had a problem')
    } else if (!foundUser) {
      res.send("Sorry, no user found")
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // currentUser=req.session;
        // currentUser.email;
        if(foundUser.isActive){
        res.send(foundUser);
        }else{
          res.send(401)
        }
      } else {
        res.send(401)
      }
   
    }
  })
})
router.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.sned('session is destroy')
  })
})
module.exports = router