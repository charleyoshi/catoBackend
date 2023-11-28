// Functions that can be used in the request handler functions in the router file
const Comment = require('../models/commentModel')
const mongoose = require('mongoose');


// GET all comments & replies from a video
const getComments = async (req, res) => {
    const { vid } = req.params
    const { sortBy } = req.query

    if (sortBy === 'best') {
        // most vote difference and number of replies
        const comments = await Comment.aggregate([
            {
                $match: { vid: vid, parentID: null }
            },
            { "$addFields": { "_idToString": { "$toString": "$_id" } } },
            {
                $lookup: {
                    from: 'votes',
                    localField: '_idToString',
                    foreignField: 'commentID',
                    as: 'votes'
                }
            },
            {
                $addFields: {
                    upvotes: {
                        $size: {
                            $filter: { input: '$votes', cond: { $eq: ['$$this.voteType', 'upvote'] } }
                        }
                    },
                    downvotes: {
                        $size: {
                            $filter: { input: '$votes', cond: { $eq: ['$$this.voteType', 'downvote'] } }
                        }
                    }
                }
            },

            {
                $addFields: {
                    voteDifference: { $subtract: ['$upvotes', '$downvotes'] }
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_idToString',
                    foreignField: 'parentID',
                    as: 'replies'
                }
            },
            {
                $addFields: {
                    numReplies: { $size: '$replies' }
                }
            },

            {
                $addFields: {
                    sortingScore: { $add: ['$voteDifference', '$numReplies'] }
                }
            },
            {
                $sort: { sortingScore: -1 }
            }
        ]);
        const replies = await Comment.find({ vid: vid, parentID: { $ne: null } }).sort({ createdAt: -1 });
        res.status(200).json({ comments: comments, replies: replies })
    } else {
        // default: newest first
        const comments = await Comment.find({ vid: vid, parentID: null }).sort({ createdAt: -1 })
        const replies = await Comment.find({ vid: vid, parentID: { $ne: null } }).sort({ createdAt: -1 })
        res.status(200).json({ comments: comments, replies: replies })
    }

}


// POST a comment
const createComment = async (req, res) => {
    const { vid } = req.params
    const { text, parentID, userID } = req.body

    // add doc to db
    try {
        const comment = await Comment.create({ vid, text, parentID, userID })
        res.status(201).json(comment)
    } catch (error) {
        res.status(400).json({ error: error.message, code: error.name })
    }
}



module.exports = {
    getComments, createComment
}



