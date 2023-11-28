// Functions that can be used in the request handler functions in the router file
const Video = require('../models/videoModel')
const mongoose = require('mongoose')
const axios = require('axios')


// Fresh: newest comments createdAt (get the comment.vid-> get the db.videos)
// Hot: most comments over the past 3 days
// GET all videos
const getVideos = async (req, res) => {
    var { locales, amount } = req.query

    if (!locales) {
       locales = ['en', 'en-gb', 'en-us', 'en-ca', 'en-au', 'en-nz']
    }

    const videos = await Video.find({ locale: { "$in" : locales} }).sort({ createdAt: -1 }).limit(amount)
    // const videos = await Video.find().sort({ createdAt: -1 })
    res.status(200).json({ videos: videos })
}

// GET single video
const getVideo = async (req, res) => {
    const { id } = req.params

    const video = await Video.findOne({ vid: id })

    if (!video) {
        return res.status(404).json({ error: "No such video." })
    }

    res.status(200).json(video)
}


// POST a new video
const createVideo = async (req, res) => {
    const { id } = req.body

    const videoObject = await getVideoObject(id)
    if (!videoObject) {
        return res.status(404).json({ error: "No such video in Youtube API." })
    }

    // add doc to db
    try {
        const video = await Video.create({ ...videoObject.video })
        res.status(201).json(video)
    } catch (error) {
        res.status(400).json({ error: error.message, code: error.name })
    }

}


// UPDATE a video
const updateVideo = async (req, res) => {
    const { id } = req.params

    const videoObject = await getVideoObject(id)
    if (!videoObject) {
        return res.status(404).json({ error: "No such video in Youtube API." })
    }

    const video = await Video.findOneAndUpdate({ vid: id }, { ...videoObject.video })

    if (!video) {
        return res.status(404).json({ error: "No such video." })
    }

    res.status(200).json(video)
}



const getVideoObject = async (id) => {
    // Get video info from Youtube API
    const uriSnippet = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    const uriContentDetails = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    const uriStatistics = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    const uriChannel = `https://www.googleapis.com/youtube/v3/channels?part=snippet&key=${process.env.YOUTUBE_API_KEY}&id=`

    try {
        const response = await axios.get(uriSnippet)

        if (response.data.items.length === 0) { return }

        var snippet = {}
        if (response.data.items && response.data.items[0] && response.data.items[0].snippet && Object.keys(response.data.items[0].snippet).length > 0) {
            const info1 = response.data.items[0].snippet
            snippet = { vid: id, title: info1.title, description: info1.description, publishedAt: info1.publishedAt, author: info1.channelTitle, thumbnail: info1.thumbnails.maxres ? info1.thumbnails.maxres.url : info1.thumbnails.medium.url, locale: info1.defaultLanguage ? info1.defaultLanguage.toLowerCase() : info1.defaultAudioLanguage ? info1.defaultAudioLanguage.toLowerCase() : null }

            const [res1, res2, res3] = await Promise.all([
                axios.get(uriContentDetails).catch(() => null),
                axios.get(uriStatistics).catch(() => null),
                axios.get(uriChannel.concat(info1.channelId)).catch(() => null),
            ]);

            let duration = {
                duration: (res1 && res1.data.items && res1.data.items[0] && res1.data.items[0].contentDetails && Object.keys(res1.data.items[0].contentDetails).length > 0 && res1.data.items[0].contentDetails.duration)
                    ? res1.data.items[0].contentDetails.duration : ""
            }

            let statistics = (res2 && res2.data.items && res2.data.items[0] && res2.data.items[0].statistics && Object.keys(res2.data.items[0].statistics).length > 0)
                ? { views: (res2.data.items[0].statistics.viewCount) ? Number(res2.data.items[0].statistics.viewCount) : null, isCato: (!res2.data.items[0].statistics.commentCount) ? true : false } : { views: null, isCato: null }

            let avatar = {
                avatar: (res3 && res3.data.items && res3.data.items[0] && res3.data.items[0].snippet && Object.keys(res3.data.items[0].snippet).length > 0 && res3.data.items[0].snippet.thumbnails)
                    ? res3.data.items[0].snippet.thumbnails.default.url : ""
            }
            return { video: { ...snippet, ...duration, ...statistics, ...avatar } }

        }
        return
    } catch { return }
}


module.exports = {
    getVideos, getVideo, createVideo, updateVideo
}



