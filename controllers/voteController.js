// Functions that can be used in the request handler functions in the router file
const Vote = require('../models/voteModel')
const mongoose = require('mongoose')


// GET votes from a comment
const getVotes = async (req, res) => {
    const { cid } = req.params

    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(404).json({ error: "Invalid mongoose ID type." })
    }

    const upvotes = await Vote.find({ commentID: cid, voteType: 'upvote' })
    const downvotes = await Vote.find({ commentID: cid, voteType: 'downvote' })
    const votes = await Vote.find({ commentID: cid })
    res.status(200).json({ upvotes: upvotes, downvotes: downvotes, votes: votes })
}


// vote for a comment
const vote = async (req, res) => {
    const { cid } = req.params
    const { userID, voteType } = req.body

    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(404).json({ error: "Invalid mongoose ID type." })
    }

    const exists = await Vote.exists({ commentID: cid, userID: userID })
    if (exists) {
        return res.status(403).json({ error: "You can only upvote or downvote a comment once." })
    }

    // add doc to db
    try {
        const vote = await Vote.create({ commentID: cid, userID, voteType })
        res.status(201).json(vote)
    } catch (error) {
        res.status(400).json({ error: error.message, code: error.name })
    }
}



module.exports = {
    getVotes, vote
}



