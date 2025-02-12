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
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Racer'
    },
})

module.exports = mongoose.model('Race', raceSchema)