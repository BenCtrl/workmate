import React from 'react'
import { Outlet } from 'react-router-dom';

import { WorkspaceTabs } from '../components/WorkspaceTabs';

const WorkspaceLayout = () => {
  return (
    <div id="workspace-wrapper">
      <WorkspaceTabs />

      <div id="workspace">
        <Outlet />
      </div>
    </div>
  )
}

export default WorkspaceLayout