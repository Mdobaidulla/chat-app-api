const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/users.js')
let currentUser;
router.get('/new', (req, res) => {
  res.send(currentUser)
})

// on sessions form submit (log in)
router.post('/', (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    console.log(foundUser);
    if (err) {
      console.log(err)
      res.send('oops the db had a problem')
    } else if (!foundUser) {
      res.send("Sorry, no user found")
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // add the user to our session
          req.currentUser = req.session
        // redirect back to our home page

        res.send(foundUser);
       
      } else {
        // passwords do not match
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