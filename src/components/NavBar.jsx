import React from 'react'
import { ImCheckmark } from "react-icons/im";
import '../styling/navbar.css'

const NavBar = () => {
  return (
    <div id="navbar">
      <div className="app-identifier">
        <i className='app-name'>workmate</i>
        <ImCheckmark style={{
          position: 'relative',
          marginLeft: '0.4rem',
          top: '0',
          color: '#3d3d3d87'
        }} />
      </div>

      <i style={{fontSize: "1rem", color: "#bbbbbb"}}>Your friend for work :)</i>
    </div>
  )
}

export default NavBar