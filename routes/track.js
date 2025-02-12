const express = require('express')
const router = express.Router()
const Track = require('../models/track')
const User = require('../models/user')

// All Races Route
router.get('/', async (req, res) => {
    try {
        if(req.session.user){
            const id = req.session.user.id
            const user = await User.findById({ _id: id })

            if(user.admin){
                const tracks = await Track.find({})
                res.render('track/index', { tracks: tracks })
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    } catch {
        res.redirect('/')
    }
})

// New Race Route
router.get('/new', async (req, res) => {
    try {
        if(req.session.user){
            const id = req.session.user.id
            const user = await User.findById({ _id: id })
    
            if(user.admin){
                res.render('track/new', { track: new Track() })
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    } catch {
        res.redirect('/')
    }
})

// Create Race Route
router.post('/', async (req, res) => {
    const track = new Track({
        name: req.body.title,
        laps: req.body.laps
    })
    try {
        const newTrack = await track.save()
        res.send('')
    } catch {
        res.render('track/new', {
            track: track,
            errorMessage: 'Error creating the track.'
        })
    }
})

// Fetch All Races 
router.get('/all-tracks', async (req, res) => {
    const track = await Track.find({})
    res.send(JSON.stringify(track))
})

// All Races Route
router.post('/delete-track', async (req, res) => {
    const deleteTrack = await Track.deleteOne({ _id: req.body.id })
    res.send('')
})

module.exports = router
