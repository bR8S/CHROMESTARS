const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
    const racers = await User.find({})
    res.render('../views/index.ejs', { racers: racers })
})

module.exports = router