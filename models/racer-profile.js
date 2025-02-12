const mongoose = require('mongoose')

const racerSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        required: false,
    },
    losses: {
        type: Number,
        required: false,
    }
})

module.exports = mongoose.model('Racer', racerSchema)