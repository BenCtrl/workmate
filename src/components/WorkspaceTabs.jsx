import React, { useState } from 'react';
import { HiOutlinePencilAlt, HiOutlineCalendar, HiOutlineDocumentText } from "react-icons/hi";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

import WorkspaceTab from './WorkspaceTab';

export const WorkspaceTabs = () => {

  return (
    <div id="workspace-tabs">
      <WorkspaceTab icon={<HiOutlinePencilAlt />} pageTitle="Sticky Notes" to="/stickynotes" />
      <WorkspaceTab icon={<HiOutlineDocumentText />} pageTitle="Pages" to="/pages" />
      <WorkspaceTab icon={<HiOutlineCalendar  />} pageTitle="Calendar" to="/calendar" />

      <WorkspaceTab icon={<HiOutlineCog8Tooth  />} pageTitle="Settings" style={{marginTop: "auto", borderTop: "1px solid #bbbbbb"}} to="/settings" />
    </div>
  )
}
