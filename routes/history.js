const express = require('express')
const router = express.Router()
const Race = require('../models/race')
const User = require('../models/user')

// All Races Route
router.get('/', async (req, res) => {
    try {
        const race = await Race.find({})
        const racers = await User.find({})
        res.render('history/index', { race: race, racers: racers})
    } catch {
        res.redirect('/')
    }
})

module.exports = router