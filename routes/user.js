const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('', async (req, res) => {
    if(req.session.user){
        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )

        res.render('../views/user/user.ejs', { id: user.id, profile_image: user.profile_image, background_image: user.background_image, username: user.username, phone_number: user.phone_number, first_name: user.first_name, last_name: user.last_name, email: user.email, bio: user.bio, password: user.password })
    }
    else {
        res.redirect('/login')
    }
})

// New Racer Route
router.get('/new', async (req, res) => {
    res.render('racer/new', { racer: new User() })
})

// Check if user is logged in
router.get('/logged-in', async (req, res) => {
    let userAuth = false

    if(req.session.user){
        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )
        userAuth = true
        if(user){
            res.send(userAuth)
        }
    }
    else {
        res.send(userAuth)
    }
})

// Check if user has correct perms
router.get('/admin-perms', async (req, res) => {
    let userAdmin = false

    if(req.session.user){
        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )
        userAdmin = true
        if(user){
            res.send(userAdmin)
        }
    }
    else {
        res.send(userAdmin)
    }
})

router.post('/update-account', async (req, res) => { 
    const id = req.body.id
    const user = await User.findById(id)

    if(user.username !== req.body.username){
        user.username = req.body.username
    }
    if(user.first_name !== req.body.first_name){
        user.first_name = req.body.first_name
    }
    if(user.last_name !== req.body.last_name){
        user.last_name = req.body.last_name
    }
    if(user.email !== req.body.email){
        user.email = req.body.email
    }
    if(user.bio !== req.body.bio){
        user.bio = req.body.bio
    }
    if(user.background_image !== req.body.background_image && req.body.background_image){
        user.background_image = req.body.background_image
    }
    if(user.profile_image !== req.body.profile_image && req.body.profile_image){
        user.profile_image = req.body.profile_image
    }

    await user.save()

    res.send('')
})

// Fetch All Racers
router.get('/all-racers', async (req, res) => {
    const allRacers = await User.find({})
    res.send(JSON.stringify(allRacers))
}) 

// Fetch Racers Given IDs
router.get('/get-racers', async (req, res) => {
    let idArray = req.query.ids.split(',')
    const allRacers = await User.find({})
    const matchingRacers = allRacers.filter(racer => idArray.includes(racer.id))
    res.send(JSON.stringify(matchingRacers))
}) 

// Fetch Racer Given ID
router.get('/:id', async (req, res) => {
    const racer = await User.find({ _id: req.params.id })
    res.send(JSON.stringify(racer))
})

// Update Racer Score Given ID
router.post('/update-score', async (req, res) => {
    console.log('/update-score')

    console.log('Racer' + req.body.id)
    console.log('Points' + req.body.points)

    const id = req.body.id
    const points = req.body.points
    
    try {
        const racer = await User.findById({ _id: id })
        console.log('Racer' + racer)
        console.log('Points' + points)
        racer.score = racer.score + points
        console.log(racer.score)
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer ELO Given ID
router.post('/update-elo', async (req, res) => {
    const id = req.body.id
    const elo = req.body.elo

    try {
        const racer = await User.findById({ _id: id })
        racer.elo = elo
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Wins Given ID
router.post('/update-win', async (req, res) => {
    const id = req.body.id
    
    try {
        const racer = await User.findById({ _id: id })
        racer.wins += 1
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Losses Given ID
router.post('/update-loss', async (req, res) => {
    const id = req.body.id
    
    try {
        const racer = await User.findById({ _id: id })
        racer.losses += 1
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Competitions Given ID
router.post('/update-competitions', async (req, res) => {
    const id = req.body.id
    
    try {
        const racer = await User.findById({ _id: id })
        racer.competitions += 1
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Avg Pos Given ID
router.post('/update-avg-pos', async (req, res) => {
    const id = req.body.id
    const placement = req.body.placement + 1
    
    try {
        const racer = await User.findById({ _id: id })
        racer.placements.push(placement)
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Best Streak Given ID
router.post('/update-streak', async (req, res) => {
    const id = req.body.id
    
    try {
        const racer = await User.findById({ _id: id })
        const requiredPlacement = 4
        let currStreak = 0
        let highestStreak = 0
        let end = racer.placements.length

        for(let i = 0; i < end; i++) {
            if (racer.placements[i] <= requiredPlacement) {
                currStreak += 1
            }
            else {
                if(currStreak > highestStreak) {
                    highestStreak = currStreak
                }
                currStreak = 0
            }
        }

        if(currStreak > highestStreak) {
            highestStreak = currStreak
        }

        racer.streak = highestStreak
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

// Update Racer Number of Podium Finishes
router.post('/update-podium-count', async (req, res) => {
    const id = req.body.id
    
    try {
        const racer = await User.findById({ _id: id })
        const requiredPlacement = 4

        let podiumCount = 0
        let end = racer.placements.length

        for(let i = 0; i < end; i++) {
            if(racer.placements[i] <= requiredPlacement){
                podiumCount++
            }
        }

        racer.podium_count = podiumCount
        await racer.save()
    } catch (e) {
        console.log(e)
    }

    res.send('')
})

//Update Racer Rivals 
router.post('/update-rivals', async (req, res) => {
    const id = req.body.id
    const standing = req.body.standing // Racer standing
    const standings = req.body.standings // All other racer standings

    try{
        const racer = await User.findById({ _id: id })
        let placementSum = 0

        // Calc racer overall avg placement
        racer.placements.forEach(placement => {
            placementSum += placement
        })

        const avgPlacement = (placementSum / racer.placements?.length).toFixed(2)

        // If standing is greater that means racer placed outside of avg, ex racer was upset
        if(standing > avgPlacement){
            // Save every racer that outplaced the current racers
            const rivalsArr = standings.slice(0, standing - 1)
            console.log('Rival ids: ' + rivalsArr)
            const rivals = await User.find({ '_id': { $in: rivalsArr } })

            console.log('Rival objects: ' + rivalsArr)

            rivals.forEach(rival => {
                racer.rivals.push(rival.username)
            })

            let rivalCount = new Map()

            racer.rivals.forEach(rival => {
                rivalCount.set(rival, (rivalCount.get(rival) || 0) + 1)
            })

            // Step 2: Sort by frequency in descending order
            let sortedRivals = Array.from(rivalCount.entries()).sort((a, b) => b[1] - a[1]);

            // Step 3: Extract the top N words
            let topRivals

            if(sortedRivals.length >= 3){
                topRivals = sortedRivals.slice(0, 3).map(([rival, count]) => ({ rival, count }))
                racer.top_rivals = topRivals
            } else {
                topRivals = sortedRivals.map(([rival, count]) => ({ rival, count }))
                racer.top_rivals = topRivals
            }
        }
        await racer.save()
    } catch(e) {
        console.log(e)
    }
    res.send('')
})

//Update Racer Tracks
router.post('/update-tracks', async (req, res) => {
    const id = req.body.id
    const track = req.body.track
    const standing = req.body.standing

    try{
        if(standing <= 3) {
            const racer = await User.findById({ _id: id })
            racer.tracks.push(track)

            //await racer.save()

            const trackCount = new Map()

            racer.tracks.forEach(track => {
                trackCount.set(track, (trackCount.get(track) || 0) + 1)
            })

            // Step 2: Sort by frequency in descending order
            const sortedTracks = Array.from(trackCount.entries()).sort((a, b) => b[1] - a[1]);

            // Step 3: Extract the top N words
            const topTracks = sortedTracks.slice(0, 3).map(([track, count]) => ({ track, count }))
            racer.top_tracks = topTracks

            await racer.save()
        }
    } catch(e) {
        console.log(e)
    }
    res.send('')
})

// Reset all racers 
router.post('/reset-racers', async (req, res) => {
    try{
        const racers = await User.find({})
        racers.forEach(async racer => {
            racer.wins = 0;
            racer.losses = 0;
            racer.competitions = 0;
            racer.score = 0;
            racer.elo = 1000;
            racer.placements = [];
            racer.streak = 0;
            racer.podium_count = 0;
            racer.rivals = [];
            racer.top_rivals = [];
            racer.tracks = [];
            racer.top_tracks = [];
            await racer.save()
        })
    } catch(e){
        console.log(e)
    }
})

// Delete all racers 
router.post('/delete-racers', async (req, res) => {
    try{
        console.log('we get here')
        await User.deleteMany({})
        res.send('All racers deleted successfully')
    } catch (e) {
        console.error(e);
        res.status(500).send('Error deleting racers')
    }
})

module.exports = router