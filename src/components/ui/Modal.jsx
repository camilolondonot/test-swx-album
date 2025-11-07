const Modal = ({ children, open, onClose }) => {
  
  return (
    <div className="modal">
      <div className="modal-box">
        {children}
      </div>
    </div>
  )
}

export default Modal