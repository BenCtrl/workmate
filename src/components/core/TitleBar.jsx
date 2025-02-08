import React from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window';

import { X, Square, Minus } from '../Icons';
import '../../styling/titlebar.css'

/**
 * Component used for desktop distributions of application, features app logo & window controls.
 */
const TitleBar = () => {
  const appWindow = getCurrentWindow();

  return (
    <div data-tauri-drag-region class="titlebar">
      <i className="app-identifier">workmate</i>

      <div>
        <div class="titlebar-button" id="titlebar-minimize" onClick={() => {appWindow.minimize()}}>
          <Minus />
        </div>
        <div class="titlebar-button" id="titlebar-maximize" onClick={() => {appWindow.toggleMaximize()}}>
          <Square />
        </div>
        <div class="titlebar-button" id="titlebar-close" onClick={() => {appWindow.close()}}>
          <X />
        </div>
      </div>
    </div>
  )
}

export default TitleBar