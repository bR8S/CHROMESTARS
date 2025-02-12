const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_image: { 
        type: String, 
        required: true
    },
    background_image: { 
        type: String, 
        required: true
    },
    bio: {
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
    },
    streak: {
        type: Number,
        required: true
    },
    podium_count: {
        type: Number,
        required: true
    },
    rivals: {
        type: Array,
        required: true
    },
    top_rivals: {
        type: Array,
        required: true
    },
    tracks: {
        type: Array,
        required: true
    },
    top_tracks: {
        type: Array,
        required: true
    }, 
    admin: {
        type: Boolean,
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
},{ versionKey: false })

module.exports = mongoose.model('User', userSchema)