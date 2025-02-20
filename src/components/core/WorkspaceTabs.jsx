import {
  IconCalendar,
  IconCog,
  IconFileText,
  IconNote
} from "../Icons";

import WorkspaceTab from './WorkspaceTab';

export const WorkspaceTabs = () => {

  return (
    <div id="workspace-tabs">
      <WorkspaceTab icon={<IconNote />} pageTitle="Sticky Notes" to="/stickynotes" />
      <WorkspaceTab icon={<IconFileText />} pageTitle="Pages" to="/pages" />
      <WorkspaceTab icon={<IconCalendar />} pageTitle="Calendar" to="/calendar" />

      <WorkspaceTab icon={<IconCog  />} pageTitle="Settings" style={{marginTop: "auto", borderTop: "1px solid #bbbbbb"}} to="/settings" />
    </div>
  )
}
