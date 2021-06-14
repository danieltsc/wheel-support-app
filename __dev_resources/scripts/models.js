const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})


const schedulerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Scheduler: mongoose.model('Scheduler', schedulerSchema)
}