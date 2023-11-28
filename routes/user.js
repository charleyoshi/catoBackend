// All user routes
const express = require('express')
const { getUser, loginUser, createUser, updateUser } = require('../controllers/userController')


// Instance of the Express Router
const router = express.Router({ mergeParams: true })


// REQUEST HANDLER FUNCTIONS

// get a user by userID
router.get('/:id', getUser) 

// Login a user
router.post('/', loginUser, createUser)

// Update new user information
router.patch('/:userID', ()=>{})




module.exports = router