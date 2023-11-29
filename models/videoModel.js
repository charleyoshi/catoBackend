const mongoose = require("mongoose")

const Schema = mongoose.Schema

const videoSchema = new Schema(
    {
        vid: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        publishedAt: { type: Date, required: true },
        author: { type: String, required: true },
        thumbnail: {type: String, required: true},

        duration: String,

        views: Number,
        isCato: Boolean,

        avatar: String,
        locale: String
    },
    { timestamps: true })


module.exports = mongoose.model('Video', videoSchema)

