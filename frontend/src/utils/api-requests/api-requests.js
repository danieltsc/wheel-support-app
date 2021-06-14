import { create } from 'axios'
const api = create({
    baseURL: 'http://52.26.1.84:5000/'
})

export const getUsers = async () => {
    const { data } = await api.get('/users')
    return data
}

export const getSchedule = async ({ date } = {}) => {
    const { data } = await api.get(`/schedule?date=${date}`)
    return data
}

export const addEngineer = async ({ email, firstName, lastName }) => {
    const { data } = await api.post('/user', { firstName, lastName, email })
    return data
}
