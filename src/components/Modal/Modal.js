import './Modal.css';
import React from 'react';

function Modal({ active, setActive, children }) {
  
  if (!active) {
    return null;
  }

  return (
    <div className="modal" onClick={() => setActive(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children} {}
      </div>
    </div>
  );
}

export default Modal;