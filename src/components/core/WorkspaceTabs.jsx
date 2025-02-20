import {
  Calendar,
  Cog,
  FileText,
  Note
} from "../Icons";

import WorkspaceTab from './WorkspaceTab';

export const WorkspaceTabs = () => {

  return (
    <div id="workspace-tabs">
      <WorkspaceTab icon={<Note />} pageTitle="Sticky Notes" to="/stickynotes" />
      <WorkspaceTab icon={<FileText />} pageTitle="Pages" to="/pages" />
      <WorkspaceTab icon={<Calendar />} pageTitle="Calendar" to="/calendar" />

      <WorkspaceTab icon={<Cog  />} pageTitle="Settings" style={{marginTop: "auto", borderTop: "1px solid #bbbbbb"}} to="/settings" />
    </div>
  )
}
