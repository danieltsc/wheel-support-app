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

app.get('/users', userController.getUsers)

app.post('/user', userController.addUser)

app.get('/schedule', scheduleController.getSchedule)

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