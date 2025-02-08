import React from 'react';
import '../../styling/navbar.css';

const NavBar = () => {
  return (
    <div id="navbar">
      <div className="app-identifier">
        <i className='app-name'>workmate</i>
      </div>

      <i style={{fontSize: "1rem", color: "#bbbbbb"}}>Your friend for work :)</i>
    </div>
  )
}

export default NavBar