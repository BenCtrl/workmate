import React, { useState } from 'react'
import { HiCodeBracket} from "react-icons/hi2";
import '../styling/navbar.css'

const NavBar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="navbar">
      <div className="app-identifier">
        <HiCodeBracket style={{marginRight: '0.3rem'}}/><i className='app-name'>workmate</i>
      </div>

      <i style={{fontSize: "1rem", color: "#bbbbbb"}}>Your friend for work :)</i>
    </div>
  )
}

export default NavBar