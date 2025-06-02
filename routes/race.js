const express = require('express')
const router = express.Router()
const Race = require('../models/race')
const User = require('../models/user')
const Track = require('../models/track')
const Event = require('../models/event')

// All Races Route
router.get('/', async (req, res) => {
    try {
        if(req.session.user){
            const id = req.session.user.id
            const user = await User.findById(id)

            console.log(user)

            if(user.admin){
                const race = await Race.find({}).populate('event', 'name')
                const racers = await User.find({})
                res.render('race/index', { race: race, racers: racers })
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
            const user = await User.findById(id)

            console.log(user)

            if(user.admin){
                const racers = await User.find({})
                const tracks = await Track.find({})
                const events = await Event.find({})
                res.render('race/new', { race: new Race(), racers: racers, tracks: tracks, events: events })
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
    let participants = req.body.participants

    if (typeof participants === 'string') {
        participants = participants.split(',').map(id => id.trim()); // Trim spaces
    }

    const racers = await User.find({ _id: { $in: participants } })
    
    const sortedRacers = participants.map(id => 
        racers.find(racer => racer._id.toString() === id.toString())
    ).filter(Boolean) // Remove undefined values

    console.log('Sorted racers: ' + sortedRacers)

    if (req.body.event === ''){
        req.body.event = null
    }

    const event = await Event.findById(req.body.event)

    const race = new Race({
        name: req.body.title,
        time: req.body.time,
        track: req.body.track,
        participants: sortedRacers,
        event: event || null
    })
    
    // participants are in order of placements so we can update racer scores accordingly here
    try {
        await race.save()
        res.send('')
    } catch (error){
        console.log(error)
        res.render('race/new', {
            race: race,
            errorMessage: 'Error creating the race'
        })
    }
})

// All Races Route
router.get('/races', async (req, res) => {
    res.render('race/races')
})

// Fetch All Races 
router.get('/api/all-races', async (req, res) => {
    const race = await Race.find({})
    res.send(JSON.stringify(race))
})

// All Races Route
router.post('/api/delete-race', async (req, res) => {
    const deleteRace = await Race.deleteOne({ _id: req.body.id })
    res.send('')
})

module.exports = router
