import React, { useContext, useEffect } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

import '../styling/workspace.css'
import NotesList from './workspaces/StickyNotes'
import Pages from './workspaces/Pages'
import WorkspaceLayout from '../layouts/WorkspaceLayout'
import Calendar from './workspaces/Calendar'
import AppSettings from './workspaces/AppSettings'
import WorkspaceNotFound from './workspaces/WorkspaceNotFound'
import PageEditor, { pageLoader } from './workspaces/PageEditor'
import { AppSettingsContext } from '../App'

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
      <Route path='/calendar' element={<Calendar />} />
      <Route path='/settings' element={<AppSettings />} />
      <Route path='*' element={<WorkspaceNotFound />} />
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