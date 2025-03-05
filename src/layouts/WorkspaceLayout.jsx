import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import { getName, getVersion } from '@tauri-apps/api/app';

import { WorkspaceTabs } from '../components/core/WorkspaceTabs';

import 'react-toastify/dist/ReactToastify.css'

import { AppSettingsContext } from '../App';

const WorkspaceLayout = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [appVersion, setAppVersion] = useState(null);
  const [appName, setAppName] = useState(null);

  const getAppDetails = async () => {
    setAppVersion(await getVersion());
    setAppName(await getName().then((result => result.toLocaleLowerCase())));
  }

  useEffect(() => {
    getAppDetails();
  }, []);

  return (
    <div id="workspace-wrapper">
      <WorkspaceTabs />

      <div id="workspace">
        <Outlet />
        <div className='workspace-app-identifier'>
          <div className='app-name'>{appName}</div>
          <div className='app-version'>v{appVersion}</div>
        </div>
      </div>
      <ToastContainer
        position='bottom-right'
        theme={appSettings.DARKMODE ? 'dark' : 'light'}
        transition={Zoom}
        pauseOnHover={false}
        closeOnClick={true}
        hideProgressBar={true}
      />
    </div>
  )
}

export default WorkspaceLayout