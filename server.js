require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const videoRoutes = require('./routes/videos')
const commentRoutes = require('./routes/comments')
const voteRoutes = require('./routes/votes')
const userRoutes = require('./routes/user')
const reportRoutes = require('./routes/report')
const { default: axios } = require('axios')

// express app
const app = express()

// middleware: fire every time receive a request. Fire BEFORE the route to the root path ('/')
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// react to requests (Routes)
app.use('/api/videos', videoRoutes)
app.use('/api/video/:vid/comments', commentRoutes)
app.use('/api/comment/:cid/votes', voteRoutes)
app.use('/api/user', userRoutes)

app.use('/api/report', reportRoutes)
app.use('/healthCheck', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.status(200).send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
})

const keepServerAlive = async () => {
    try {
        const response = await axios.get('https://cato-backend.onrender.com/healthCheck');
        console.log('Server pinged successfully.');
    } catch (error) {
        console.error('Error pinging server:', error);
    }
}

const INTERVAL_TIME = 0.5 * 60 * 1000; // 14 minutes in milliseconds

keepServerAlive()
setInterval(keepServerAlive, INTERVAL_TIME)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`connected to db & listening on port ${process.env.PORT}!!!!`)

        })
    })
    .catch((error) => {
        console.log(error)
    })


