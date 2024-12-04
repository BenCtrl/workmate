import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { HiOutlinePencilAlt, HiOutlineCalendar, HiOutlineDocumentText } from "react-icons/hi";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

import WorkspaceTab from './WorkspaceTab';
import Modal from './Modal';
import AppSettings from './AppSettings';

export const WorkspaceTabs = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="workspace-tabs">
      <NavLink className={({isActive}) => isActive ? 'selected-workspace-tab' : ''} to="/stickynotes">
        <WorkspaceTab icon={<HiOutlinePencilAlt />} pageTitle="Sticky Notes" />
      </NavLink>

      <NavLink className={({isActive}) => isActive ? 'selected-workspace-tab' : ''} to="/documents">
      <WorkspaceTab icon={<HiOutlineDocumentText />} pageTitle="Documents" />
      </NavLink>

      <NavLink className={({isActive}) => isActive ? 'selected-workspace-tab' : ''} to="/calendar">
      <WorkspaceTab icon={<HiOutlineCalendar  />} pageTitle="Calendar" />
      </NavLink>

      <WorkspaceTab onClick={() => setShowModal(true)} icon={<HiOutlineCog8Tooth  />} pageTitle="Settings" style={{marginTop: "auto", borderTop: "1px solid #bbbbbb"}} />

      {showModal &&
        createPortal(
          <Modal children={<AppSettings />} onClose={() => setShowModal(false)} modalHeading={'Settings'}/>,
          document.body
        )
      }
    </div>
  )
}
