import React from 'react'
import '../styling/navbar.css'
import { HiCodeBracket } from "react-icons/hi2";

const NavBar = () => {
  return (
    <div id="navbar">
      <div className="app-identifier">
        <HiCodeBracket style={{marginRight: '0.3rem'}}/><i className='app-name'>workmate</i>
      </div>
    </div>
  )
}

export default NavBar