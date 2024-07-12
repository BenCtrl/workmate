import React, { useState } from 'react'
import { HiCodeBracket, HiOutlineCog8Tooth } from "react-icons/hi2";
import { createPortal } from 'react-dom';
import Button from './Button';
import Modal from './Modal';
import AppSettings from './AppSettings';
import '../styling/navbar.css'

const NavBar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="navbar">
      <div className="app-identifier">
        <HiCodeBracket style={{marginRight: '0.3rem'}}/><i className='app-name'>workmate</i>
      </div>

      <Button onClick={() => setShowModal(true)} children={<HiOutlineCog8Tooth />} style={{margin: '0'}} toolTip={'Settings'} toolTipPos='left'/>
      {showModal &&
        createPortal(
          <Modal children={<AppSettings />} onClose={() => setShowModal(false)} modalHeading={'Settings'}/>,
          document.body
        )
      }
    </div>
  )
}

export default NavBar