// All report routes
const express = require('express')
const { createReport } = require('../controllers/reportController')


// Instance of the Express Router
const router = express.Router({ mergeParams: true })


// REQUEST HANDLER FUNCTIONS

// POST a new report
router.post('/', createReport)




module.exports = router