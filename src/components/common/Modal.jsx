import React from 'react';

import { Button } from '../CommonComponents';
import { X } from '../Icons';

import '../../styling/modal.css';

const Modal = ({ onClose, children, modalHeading }) => {
  return (
    <div className='modal-wrapper'>
      <div className='modal'>
        <div className='modal-heading'>
          <h3>{modalHeading}</h3>
          <Button children={<X />} onClick={onClose} toolTip={'Close modal'} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal