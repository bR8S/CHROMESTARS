const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const Race = require('../models/race')
const User = require('../models/user')

router.get('/', async (req, res) => {
    const events = await Event.find({})
    res.render('event/index', { events: events })
})

router.get('/new', async (req, res) => {
    try {
        if(req.session.user){
            const id = req.session.user.id
            const user = await User.findById(id)

            if(user.admin){
                res.render('event/new')
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

router.get('/:id/history', async (req, res) => {
    const id = req.params.id
    const event = await Event.findById(id)
    const races = await Race.find({ event: event.id })

    res.render('event/history', { event: event, races: races })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const event = await Event.findById(id)
    const races = await Race.find({ event: event.id })

    // iterate through races and add racers to eventRacer arr if they arent already existing
    // this racer instance should be an object that holds score

    let eventRacers = new Map();

    races.forEach(race => {
        race.participants.forEach((racer, index) => {
            const racerId = racer._id.toString()

            if (!eventRacers.has(racerId)) {
                const score = race.participants.length - (index + 1)
                const win = index <= 3 ? 1 : 0
                const loss = index <= 3 ? 0 : 1
                const competitions = 1
                const placements = [index + 1]

                eventRacers.set(racerId, { 
                    racer: racer,
                    stats: { score: score, wins: win, losses: loss, competitions: competitions, placements: placements } 
                });
            }
            else {
                let eventRacer = eventRacers.get(racerId)

                // Update score based on racer position
                eventRacer.stats.score += race.participants.length - (index + 1)

                // Update racer wins/losses based on racer position
                index <= 3 ? eventRacer.stats.wins++ : eventRacer.stats.losses++
                eventRacer.stats.competitions++
                eventRacer.stats.placements.push(index + 1)

                eventRacers.set(racerId, eventRacer);
            }   
        })
    })

    // 2. Convert Map to array
    const participantsArr = Array.from(eventRacers.values());
    event.participants = participantsArr

    await event.save()

    res.render('event/leaderboard', { event: event })
})

router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.title,
        details: req.body.details,
        races: [],
        participants: new Map()
    })

    try {
        const newEvent = await event.save()
        res.redirect('/')
    } catch {
        res.render('event/new', {
            event: event,
            errorMessage: 'Error creating the event.'
        })
    }
})

module.exports = router