import React from 'react'
import { Outlet } from 'react-router-dom'

import NavBar from '../components/NavBar'
import WorkSpace from '../components/WorkSpace'

export const BaseLayout = () => {
  return (
    <>
      <NavBar />
      <WorkSpace />
      <Outlet />
    </>
  )
}
