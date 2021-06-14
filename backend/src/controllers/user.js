const User = require('../models/user')

module.exports = {
    getUsers: async (req, res, next) => {
        // Get all users
        try {
            const data = await User.find({})
            res.json({ data })

        } catch (e) {
            next(e)
        }
    },
    addUser: async (req, res, next) => {
        // Add specific user
        const { email, firstName, lastName } = req.body
        const toReturn = {}
        try {
            const user = new User({ email, firstName, lastName })
            const userExists = await User.findOne({ email })
            if (!userExists) {
                await user.save()
                toReturn.message = `User ${email} added successfully.`
            } else {
                toReturn.error = `User ${email} already existing.`
            }
            res.json(toReturn)
        } catch (e) {
            next(e)
        }
    },
}