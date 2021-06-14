const mongoose = require('mongoose')

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

module.exports = mongoose.model('Scheduler', schedulerSchema)