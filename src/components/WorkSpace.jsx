import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

import '../styling/workspace.css'
import NotesList from './workspaces/StickyNotes'
import Documents from './workspaces/Documents'
import WorkspaceLayout from '../layouts/WorkspaceLayout'
import Calendar from './workspaces/Calendar'
import AppSettings from './workspaces/AppSettings'
import WorkspaceNotFound from './workspaces/WorkspaceNotFound'

const WorkSpace = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<WorkspaceLayout />}>
      <Route path='/stickynotes' element={<NotesList />} />
      <Route path='/documents' element={<Documents />} />
      <Route path='/calendar' element={<Calendar />} />
      <Route path='/settings' element={<AppSettings />} />
      <Route path='*' element={<WorkspaceNotFound />} />
    </Route>
  ));

  return (
    <RouterProvider router={router} />
  )
}

export default WorkSpace