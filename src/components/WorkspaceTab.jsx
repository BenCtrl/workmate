import React from 'react'
import { NavLink } from 'react-router-dom'

const WorkspaceTab = ({icon, pageTitle, style, onClick, to}) => {
  return (
    <NavLink style={style} className={({isActive}) => isActive ? 'selected-workspace-tab' : ''} to={to}>
      <div onClick={onClick} className="workspace-tab">
        {icon}
        <div className="workspace-tab-title">{pageTitle}</div>
      </div>
      {/* {to ? <h1></h1> : <h1></h1>} */}
    </NavLink>

    // <div style={style} onClick={onClick} className="workspace-tab">
    //   {icon}
    //   <div className="workspace-tab-title">{pageTitle}</div>
    // </div>
  )
}

export default WorkspaceTab