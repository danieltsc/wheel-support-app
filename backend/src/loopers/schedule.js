const moment = require('moment')
const cron = require('node-cron')
const mongoose = require('mongoose')
const User = require('../models/user')
const Scheduler = require('../models/scheduler')

let sortedUsers = []

let finalOrder = () => ({})

const schedulerPerWorkingDay = (days) => {
    const scheduler = []
    let daysToAdd = 0
    while (scheduler.length !== days) {

        const newWorkingDay = moment().add(daysToAdd, 'days')
        const isWeekDay = [0, 6].includes(newWorkingDay.day())

        if (!isWeekDay) {
            const formattedDay = newWorkingDay.format('YYYY-MM-DD')
            scheduler.push({ date: formattedDay, morning: null, afternoon: null })
        }
        daysToAdd++
    }
    return scheduler
}
const setProgram = () => {
    let dayScheduler = schedulerPerWorkingDay(sortedUsers.length)
    sortedUsers.forEach((user, index) => {
        const { date } = dayScheduler[index]
        const { email } = user
        const morningOrAfternoon = Math.round(Math.random()) === 0 ? 'morning' : 'afternoon'
        if (!finalOrder[date]) finalOrder[date] = { morning: null, afternoon: null }
        finalOrder[date][morningOrAfternoon] = email
        sortedUsers[index].halfsCount += 1
    })
    sortedUsers.forEach((user, userIndex) => {
        const { email } = user
        const allowedDays = dayScheduler.filter((day, dayIndex) => {
            if (!day.morning && !day.afternoon) {
                if (!(userIndex - 1 === dayIndex || userIndex === dayIndex || userIndex + 1 === dayIndex)) return day
            }
        })
        const newDayIdx = Math.floor(Math.random() * allowedDays.length)
        if (allowedDays.length) {
            const newDay = allowedDays[newDayIdx].date
            const { morning, afternoon } = finalOrder[newDay]
            const daySchedIdx = dayScheduler.findIndex((d => d.date === newDay))
            if (!morning) {
                dayScheduler[daySchedIdx].morning = email
                finalOrder[newDay].morning = email
            }
            if (!afternoon) {
                dayScheduler[daySchedIdx].afternoon = email
                finalOrder[newDay].afternoon = email
            }
        }
        sortedUsers[userIndex].halfsCount += 1
    })
}


const resetHalfCounter = () => {
    sortedUsers = sortedUsers.map(user => ({ ...user, halfsCount: 0 }))
}
const areAnyIssues = () => {
    const daysUncomplete = Object.keys(finalOrder).filter(day => finalOrder[day].morning === null || finalOrder[day].afternoon === null).length
    const usersWithoutWork = sortedUsers.filter(user => user.halfsCount !== 2).length
    if (daysUncomplete) return true
    if (usersWithoutWork) return true
    return false
}

const addInDb = async () => {
    try {
        const docToInsert = Object.keys(finalOrder).map(day => ([
            { email: finalOrder[day].morning, date: day, time: 'morning' },
            { email: finalOrder[day].afternoon, date: day, time: 'afternoon' },
        ])).flat()
        await Scheduler.insertMany(docToInsert)

    } catch (e) {
        console.log('ERROR: ', e)
    }
}

const setUsers = async () => {
    const usersData = await User.find({})
    const randomPointsPerUser = usersData.map(user => ({ ...user._doc, points: Math.random() }))
    sortedUsers = randomPointsPerUser.sort((a, b) => a.points - b.points)
}

const run = async () => {
    await setUsers()
    finalOrder = finalOrder()
    setProgram()
    let reiterate = areAnyIssues()

    while (reiterate) {
        finalOrder = {}
        resetHalfCounter()
        setProgram()
        reiterate = areAnyIssues()
    }
    if (!reiterate) {
        await addInDb()
    }
}

cron.schedule('0 0 */14 * *', async () => {
    try {
        console.log(`SCHEDULE CRON RUNNING...`)
        await run()
    } catch (e) {
        console.log(e)
    }
})

module.exports = { run }