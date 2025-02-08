import React from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window';

import '../../styling/titlebar.css'
import { HiMiniMinusSmall, HiMiniXMark } from "react-icons/hi2";
import { MdOutlineCropSquare } from "react-icons/md";

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
          <HiMiniMinusSmall />
        </div>
        <div class="titlebar-button" id="titlebar-maximize" onClick={() => {appWindow.toggleMaximize()}}>
          <MdOutlineCropSquare />
        </div>
        <div class="titlebar-button" id="titlebar-close" onClick={() => {appWindow.close()}}>
          <HiMiniXMark />
        </div>
      </div>
    </div>
  )
}

export default TitleBar