const express = require('express')
const router = express.Router()
const Race = require('../models/race')
const Racer = require('../models/racer')
const User = require('../models/user')
const Track = require('../models/track')

// All Races Route
router.get('/', async (req, res) => {
    try {
        if(req.session.user){
            const id = req.session.user.id
            const user = await User.findById({ _id: id })

            if(user.admin){
                const race = await Race.find({})
                const racers = await User.find({})
                res.render('race/index', { race: race, racers: racers})
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
                const racers = await User.find({})
                const tracks = await Track.find({})
                res.render('race/new', { race: new Race(), racers: racers, tracks: tracks })
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
    const race = new Race({
        name: req.body.title,
        time: req.body.time,
        participants: req.body.participants
    })
    
    // participants are in order of placements so we can update racer scores accordingly here
    try {
        const newRace = await race.save()
        res.send('')
    } catch {
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
