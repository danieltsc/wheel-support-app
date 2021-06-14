import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import moment from 'moment'
import Header from '../../components/Header/Header'
import Modal from '../../components/Modal/Modal'
import 'react-calendar/dist/Calendar.css';
import './Home.css'

import { getUsers, getSchedule, addEngineer } from '../../utils/api-requests/api-requests'

const ViewEngineers = ({ data }) => {
    return (
        <>
            <div className='user-content-header'>
                <div>Email</div>
                <div>First Name</div>
                <div>Last Name</div>
            </div>
            <div className='user-content-container'>
                <ul
                    className='user-content'
                >
                    {data.length && data.map((user, index) => {
                        const { firstName, lastName, email } = user
                        return (
                            <li
                                key={email}
                            >
                                <span>{email}</span>
                                <span>{firstName}</span>
                                <span>{lastName}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

const ViewAddEngineer = () => {
    const [error, setError] = useState()
    const [message, setMessage] = useState()
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const addNewEngineer = async () => {
        try {
            const data = await addEngineer({ email, firstName, lastName })
            setTimeout(() => {
                setError(null)
                setMessage(null)
            }, 2000)
            if (data.error) setError(data.error)
            if (data.message) setMessage(data.message)
        } catch (e) {
            setTimeout(() => setError(null), 2000)
            setError(`Could not add ${email}. Please try again later.`)
        }
    }
    return (
        <div className='view-add-engineer-container'>
            <div>
                <h3>Add new Engineer. It will be assigned on the next schedule loop</h3>
            </div>
            <div className='view-add-info-container'>
                <div>
                    <input placeholder='Email' onChange={e => setEmail(e.target.value)} />
                    <input placeholder='First Name' onChange={e => setFirstName(e.target.value)} />
                    <input placeholder='Last Name' onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                    <button className='add-engineer-button' onClick={async () => await addNewEngineer()}>Add New Engineer</button>
                </div>
            </div>
            <div className='return-info'>
                {error && <div className='return-error'>{error}</div>}
                {message && <div className='return-message'>{message}</div>}
            </div>
        </div>
    )
}

const Home = () => {
    const [usersData, setUsersData] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [workingToday, setWorkingToday] = useState([])
    const [changeShift, setChangeShift] = useState(false)
    const [usersInfo, setUsersInfo] = useState([])
    const [modalProps, setModalProps] = useState({ title: '' })
    const [show, setShow] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD')
            const { data } = await getSchedule({ date: formattedDate })
            const { nextDays, scheduleToday } = data
            setWorkingToday(scheduleToday)
            setUsersData(nextDays)
        }
        fetchData()
    }, [selectedDate])

    const changeDate = e => {
        setSelectedDate(e)
    }

    const toggleShift = () => {
        setChangeShift(!changeShift)
    }

    const switchShift = async () => {
        console.log('switched !')
    }

    const showEngineers = async () => {
        try {
            const { data } = await getUsers()
            setUsersInfo(data)
            setModalProps({ ...modalProps, title: 'View Engineers', children: () => <ViewEngineers data={data} /> })
            setShow(!show)
        } catch (e) {

        }
    }

    const showAddEngineer = () => {
        try {
            setModalProps({ ...modalProps, title: 'Add Engineer', children: () => <ViewAddEngineer /> })
            setShow(!show)
        } catch (e) {

        }
    }
    return (
        <div>
            <Header
                showEngineers={showEngineers}
                showAddEngineer={showAddEngineer}
            />
            {show && <div className="App">
                <Modal
                    onClose={() => setShow(!show)} show={show}
                    title={modalProps.title}
                >
                    {modalProps.children()}
                </Modal>
            </div>
            }
            <div className={'calendar-container'}>
                <Calendar
                    value={selectedDate}
                    onChange={changeDate}
                    className='calendar'
                />
                <div className={'info-date-container'}>
                    <div>
                        <div className='work-today-message'>Working on {moment(selectedDate).format('YYYY-MM-DD')}</div>
                        <ul className='work-today-people'>
                            {workingToday.length ? workingToday.map(data => {
                                const { email, time } = data
                                return (
                                    <li key={email}>{email} ( {time} )</li>
                                )
                            }) : <div>No one working.</div>}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                {usersData.length ?
                    <div>
                        <div className={'schedule-message'}>
                            <span>
                                Schedule for the next 5 days starting from {moment(selectedDate).format('YYYY-MM-DD')}
                            </span>
                        </div>
                        <ul className='shift-container'>
                            {usersData.map(data => {
                                const { email, date, time } = data
                                return (
                                    <li
                                        className={changeShift ? 'active-shift-element shift-element' : 'shift-element'}
                                        onClick={switchShift}
                                        key={`${email}-${date}-${time}`}
                                    >
                                        <div>
                                            <div>{date} - {time}</div>
                                            <div className='user-email'>{email}</div>
                                        </div>
                                        <div className='change-shift-container'>
                                            <button onClick={toggleShift}>Change Shift</button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div> : <div className='no-data-message'>
                        No data to show.
                    </div>}
            </div>
        </div >
    )
}

export default Home