import React from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window';

import { IconMinus, IconSquare, IconX } from '../Icons';
import '../../styling/titlebar.css'

/**
 * Component used for desktop distributions of application, features app logo & window controls.
 */
const TitleBar = () => {
  const appWindow = getCurrentWindow();

  return (
    <div data-tauri-drag-region className="titlebar">
      <i className="app-identifier">workmate</i>

      <div>
        <div className="titlebar-button" id="titlebar-minimize" title="Minimize" onClick={() => {appWindow.minimize()}}>
          <IconMinus />
        </div>
        <div className="titlebar-button" id="titlebar-maximize" title="Toggle Maximize" onClick={() => {appWindow.toggleMaximize()}}>
          <IconSquare />
        </div>
        <div className="titlebar-button" id="titlebar-close" title="Close" onClick={() => {appWindow.close()}}>
          <IconX />
        </div>
      </div>
    </div>
  )
}

export default TitleBar