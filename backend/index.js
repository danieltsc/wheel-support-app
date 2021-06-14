const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment')
const { run } = require('./src/loopers/schedule')
const app = express()

const userController = require('./src/controllers/user')
const scheduleController = require('./src/controllers/scheduler')

app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
    res.send('Alive and well :)')
})

// Get all users
app.get('/users', userController.getUsers)

// Add new user
app.post('/user', userController.addUser)

// Get schedule
app.get('/schedule', scheduleController.getSchedule)

// Schedule manually (option only for testing with postman)
app.post('/schedule-manually', scheduleController.scheduleManually)


const {
    PORT = 5000,
    MONGO_USER = 'danitsc',
    MONGO_PASSWORD = 1234
} = process.env

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.txzjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT, () => console.log(`Backend listening on port ${PORT}...`))
    })
    .catch(e => {
        console.log(`Could not start backend: ${e}`)
    })