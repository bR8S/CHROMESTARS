const mongoose = require('mongoose')

const raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    track: {

    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Event'
    },
    participants: {
        type: Array,
        required: true,
        ref: 'Racer'
    },
})

module.exports = mongoose.model('Race', raceSchema)