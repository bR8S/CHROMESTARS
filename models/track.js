const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    laps: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Track', trackSchema)