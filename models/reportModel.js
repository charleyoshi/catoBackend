const mongoose = require("mongoose")

const Schema = mongoose.Schema


const reportSchema = new Schema(
    {
        commentID: { type: String, required: true },
        reasons: { type: [String], required: true }
    },
    { timestamps: true })



module.exports = mongoose.model('Report', reportSchema)


