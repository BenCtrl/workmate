import React from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window';

import '../../styling/titlebar.css'
import { HiMiniMinusSmall, HiMiniXMark } from "react-icons/hi2";
import { MdOutlineCropSquare } from "react-icons/md";

const TitleBar = () => {
  const appWindow = getCurrentWindow();

  return (
    <div data-tauri-drag-region class="titlebar">
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
  )
}

export default TitleBar