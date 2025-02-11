import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { WorkspaceTabs } from '../components/core/WorkspaceTabs';
import { AppSettingsContext } from '../App';
import 'react-toastify/dist/ReactToastify.css'

const WorkspaceLayout = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);

  return (
    <div id="workspace-wrapper">
      <WorkspaceTabs />

      <div id="workspace">
        <Outlet />
      </div>
      <ToastContainer
        position='bottom-right'
        theme={appSettings.DARKMODE ? 'dark' : 'light'}
      />
    </div>
  )
}

export default WorkspaceLayout