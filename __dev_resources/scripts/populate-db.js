const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { User } = require('./models')
const { run } = require('./schedule')

const mockUsers = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mock-users.json')))

const {
    MONGO_USER = 'danitsc',
    MONGO_PASSWORD = 1234
} = process.env

const removeCollections = async () => {
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.remove()
    }
}

const populateUsers = async () => {
    console.log(`Adding users...`)
    await User.insertMany(mockUsers)
}

const populateScheduler = async () => {
    console.log(`Populating scheduler...`)
    await run()
}

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.txzjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(async () => {
        await removeCollections()
        await populateUsers()
        await populateScheduler()
        process.exit(-1)
    })
    .catch(e => {
        console.log(`Could not start backend: ${e}`)
    })