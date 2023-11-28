// All comment routes
const express = require('express')
const { getComments, createComment } = require('../controllers/commentController')


// Instance of the Express Router
const router = express.Router({ mergeParams: true })


// REQUEST HANDLER FUNCTIONS

// GET all comments & replies from a video
router.get('/', getComments)

// POST a new comment
router.post('/', createComment)




module.exports = router