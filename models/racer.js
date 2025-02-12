const mongoose = require('mongoose')

const racerSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        required: true,
    },
    losses: {
        type: Number,
        required: true,
    }, 
    competitions: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true
    },
    elo: {
        type: Number,
        required: true
    },
    placements: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Racer', racerSchema)