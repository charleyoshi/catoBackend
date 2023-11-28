// Functions that can be used in the request handler functions in the router file
const Report = require('../models/reportModel')
const mongoose = require('mongoose')


// POST a new report
const createReport = async (req, res) => {
    const { commentID, reasons } = req.body
    console.log(commentID, reasons)    
     // add doc to db
     try {
        const report = await Report.create({ commentID,reasons })
        res.status(201).json(report)
    } catch (error) {
        res.status(400).json({ error: error.message, code: error.name })
    }
}

module.exports = {
    createReport
}


