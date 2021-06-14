import './Header.css'

const Header = ({ showEngineers, showAddEngineer }) => {
    return (
        <div className='header-container'>
            <div>
                <p>Support Wheel of Fate</p>
            </div>
            <div style={{
                display: 'flex'
            }}>
                <div
                    style={{
                        marginRight: 10,
                    }}>
                    <span
                        className='headers-button'
                        onClick={async () => await showEngineers()}
                    >
                        View engineers
                    </span>
                </div>
                <div
                    style={{
                        marginLeft: 10,
                    }}>
                    <span onClick={showAddEngineer} className='headers-button'>Add engineer</span>
                </div>
            </div>
        </div>
    )
}

export default Header