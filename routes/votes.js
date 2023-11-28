// All vote routes
const express = require('express')
const { getVotes, vote } = require('../controllers/voteController')


// Instance of the Express Router
const router = express.Router({ mergeParams: true })


// REQUEST HANDLER FUNCTIONS

// GET votes from a comment
router.get('/', getVotes)

// POST vote for a comment
router.post('/', vote)




module.exports = router