import React, { useContext } from 'react';
import Button from './Button';
import { IconX } from '../Icons';

import { AlertContext } from './Modal';

const Alert = ({alertType, message}) => {
  const alertContext = useContext(AlertContext);

  return (
    <div className={`alert ${alertType}`}>
      <span className='alert-message'>{message}</span>
      <Button className='close-alert mini' children={<IconX />} onClick={() => {alertContext.resetAlert()}} />
    </div>
  )
}

export default Alert