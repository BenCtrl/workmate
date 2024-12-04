import React from 'react'

const WorkspaceTab = ({icon, pageTitle, style, onClick}) => {
  return (
    <div style={style} onClick={onClick} className="workspace-tab">
      {icon}
      <div className="workspace-tab-title">{pageTitle}</div>
    </div>
  )
}

export default WorkspaceTab