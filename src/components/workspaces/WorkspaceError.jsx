import React, { useEffect } from 'react';

import '../../styling/work-space-error.css';
import { useNavigate, useRouteError } from 'react-router-dom';
import { error } from '@tauri-apps/plugin-log';
import { Button } from '../CommonComponents';

const WorkspaceError = () => {
  const routeError = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    error(routeError.stack);
  }, []);

  return (
    <div className="workspace-error-container">
      <div className="error-title">Well, that didn't work!</div>
      <div className="error-message">An unexpected error occured.</div>
      <Button children={'Go Back'} onClick={() => {navigate('/')}} />
    </div>
  )
}

export default WorkspaceError