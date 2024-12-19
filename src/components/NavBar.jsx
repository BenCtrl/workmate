import React from 'react'
import { ImCheckmark } from "react-icons/im";
import '../styling/navbar.css'

const NavBar = () => {
  return (
    <div id="navbar">
      <div className="app-identifier">
        <i className='app-name'>workmate</i>
        <ImCheckmark className='app-icon' />
      </div>

      <i style={{fontSize: "1rem", color: "#bbbbbb"}}>Your friend for work :)</i>
    </div>
  )
}

export default NavBar