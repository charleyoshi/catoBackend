// Functions that can be used in the request handler functions in the router file
const User = require('../models/userModel')
const { jwtDecode } = require('jwt-decode')

// Get user by ID
const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findOne({userID: id})

    if (!user) {
        // user is anonymous
        return res.status(204).json()
    }

    res.status(200).json(user)
}


// POST Login a user
const loginUser = async (req, res, next) => {
    const { IDToken } = req.body

    // get the IDtoken -> decode -> find userID in db
    if (!IDToken) { return res.status(404).json({ error: "ID Token not found." }) }

    const user = getGoogleUser(IDToken)
    if (user.error) { return res.status(400).json({ error: user.error }) }

    const existingUser = await User.findOne({ userID: user.found.sub })

    // login
    if (existingUser) { return res.status(200).json(existingUser) }

    // createUser
    res.locals.newUser = user.found
    next();
}


// Create new user
const createUser = async (req, res) => {
    const { sub: userID, given_name: firstName, family_name: lastName, picture: imageURL } = res.locals.newUser

    // add doc to db
    try {
        const user = await User.create({ userID, firstName, lastName, imageURL })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(400).json({ error: error.message, code: error.name })
    }
}


const getGoogleUser = (IDToken) => {
    try {
        const decoded = jwtDecode(IDToken)
        const hasAllKeys = ["sub", "given_name"].every(item => decoded.hasOwnProperty(item))
        if (hasAllKeys) {
            return { found: decoded }
        }
        return { error: "Invalid authentication type." }

    } catch (error) {
        return { error: "Invalid ID Token." }
    }
}

module.exports = {
    getUser, loginUser, createUser
}



