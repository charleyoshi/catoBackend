const mongoose = require("mongoose")

const Schema = mongoose.Schema


const commentSchema = new Schema(
    {
        vid: { type: String, required: true },
        text: { type: String, required: true },
        parentID: String,
        userID: String
    },
    { timestamps: true })



module.exports = mongoose.model('Comment', commentSchema)

// Note: the built-in _id is going to be the commentID
