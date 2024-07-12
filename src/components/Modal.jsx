import React from 'react'
import Button from './Button'
import '../styling/modal.css'
import { HiXMark } from "react-icons/hi2";

const Modal = ({ onClose, children, modalHeading }) => {
  return (
    <div className='modal-wrapper'>
      <div className='modal'>
        <div className='modal-heading'>
          <h3>{modalHeading}</h3>
          <Button children={<HiXMark />} style={{margin: '1rem 0'}} onClick={onClose} className={'cancel'}/>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal