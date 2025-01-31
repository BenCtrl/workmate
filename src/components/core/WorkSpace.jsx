import React, { useContext, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import AppSettings from '../workspaces/AppSettings';
import CalendarPlanner from '../workspaces/CalendarPlanner';
import NotesList from '../workspaces/StickyNotes';
import PageEditor, { pageLoader } from '../workspaces/PageEditor';
import Pages from '../workspaces/Pages';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import WorkspaceError from '../workspaces/WorkspaceError';
import { AppSettingsContext } from '../../App';
import '../../styling/workspace.css';

const WorkSpace = () => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const setAppTheme = () => {
    document.documentElement.setAttribute("data-theme", SETTINGS.DARKMODE ? "dark" : "light");
  }

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<WorkspaceLayout />}>
      <Route path='/stickynotes' element={<NotesList />} />
      <Route path='/pages' element={<Pages />} />
      <Route path='/pages/editor' element={<PageEditor />} />
      <Route path='/pages/editor/:id' element={<PageEditor />} loader={pageLoader}/>
      <Route path='/calendar' element={<CalendarPlanner />} />
      <Route path='/settings' element={<AppSettings />} />
      <Route path='*' element={<WorkspaceError errorCode={'404'} errorMessage={'Error - Workspace not found!'}/>} />
    </Route>
  ));

  useEffect(() => {
    setAppTheme();
  }, [SETTINGS]);

  return (
    <RouterProvider router={router} />
  )
}

export default WorkSpace