import './Modal.css'

const Modal = ({ children, onClose, title }) => {
    return (
        <div className='modal-container'>
            <div className='modal-view'>
                <div className='info-view'>
                    <h2>{title}</h2>
                    <div class="content">{children}</div>
                </div>
                <div>
                    <div class="actions">
                        <button class="toggle-button" onClick={onClose}>
                            Close
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal