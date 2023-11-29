const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        userID: { type: String, required: true, unique: true },
        firstName: { type: String, required: true, default: "" },
        lastName: { type: String, required: true, default: "" },
        imageURL: { type: String, required: true, default: "" }
    },
    { timestamps: true })

module.exports = mongoose.model('User', userSchema)