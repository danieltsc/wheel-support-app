const moment = require('moment')
const Scheduler = require('../models/scheduler')
const { run } = require('../loopers/schedule')

module.exports = {
    getSchedule: async (req, res, next) => {
        const {
            date = moment().format('YYYY-MM-DD'),
            filters = {}
        } = req.query

        try {
            let limit = 10
            const query = {

            }
            if (!Object.keys(filters).length) {
                // return next 5 days from current day
                query.date = {
                    $gte: date,
                }
            } else {
                const { selectedDate } = filters
                query.date = { date: selectedDate }
            }
            const response = await Scheduler.find(query).limit(10)
            const scheduleToday = response.filter(r => r.date === date)
            res.json({ data: { scheduleToday, nextDays: response } })
        } catch (e) {
            next(e)
        }
    },
    scheduleManually: async (req, res, next) => {
        try {
            await run()
            res.json({ message: `Scheduler ran successfully.` })
        } catch (e) {
            next(e)
        }
    }
}