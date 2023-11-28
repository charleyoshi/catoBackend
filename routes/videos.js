// All video routes
const express = require('express')
const { getVideos, getVideo, createVideo, updateVideo} = require('../controllers/videoController')

// Instance of the Express Router
const router = express.Router()


// REQUEST HANDLER FUNCTIONS

// GET all videos
router.get('/', getVideos)

// GET a video
router.get('/:id', getVideo)

// POST a new video
router.post('/', createVideo)


// UPDATE a video
router.patch('/:id', updateVideo)


module.exports = router