import './Modal.css'

const Modal = ({ children, onClose, title }) => {
    return (
        <div className='modal-container'>
            <div className='modal-view'>
                <div className='info-view'>
                    <h2>{title}</h2>
                    <div className="content">{children}</div>
                </div>
                <div>
                    <div className="actions">
                        <button className="toggle-button" onClick={onClose}>
                            Close
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal