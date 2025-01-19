import React from 'react';

import '../../styling/workspace-error.css';

const WorkspaceError = ({errorCode, errorMessage}) => {
  return (
    <div className="workspace-error-container">
      <div className="error-code">{errorCode}</div>
      <div className="error-message">{errorMessage}</div>
    </div>
  )
}

export default WorkspaceError