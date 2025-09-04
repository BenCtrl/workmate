import React, { useState, createContext } from 'react';

import { Alert, Button } from '../CommonComponents';
import { IconX } from '../Icons';
import '../../styling/modal.css';

export const ModalContext = createContext(null);

const Modal = ({ onClose, children, modalHeading }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const setAlert = (alertType, alertMessage) => {
    setAlertMessage(alertMessage);
    setAlertType(alertType);
  }

  const resetAlert = () => {
    setAlertMessage('');
    setAlertType('');
  }

  return (
    <ModalContext.Provider value={{setAlert, resetAlert, onClose}}>
      <div className='modal-wrapper'>
        <div className='modal'>
          <div className='modal-heading'>
            <h3>{modalHeading}</h3>
            <Button children={<IconX />} onClick={onClose} toolTip={'Close modal'} />
          </div>
          <div className="modal-content">
            {children}
          </div>
        </div>
        {alertMessage && <Alert alertType={alertType} message={alertMessage} dismissable={true} />}
      </div>
    </ModalContext.Provider>
  )
}

export default Modal