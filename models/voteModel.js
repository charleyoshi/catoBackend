const mongoose = require("mongoose")

const Schema = mongoose.Schema


const voteSchema = new Schema(
    {
        commentID: { type: String, required: true },
        userID: { type: String, required: true },
        voteType: { type: String, required: true, enum: ['upvote', 'downvote'] },
    })



module.exports = mongoose.model('Vote', voteSchema)


