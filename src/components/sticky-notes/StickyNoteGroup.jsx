import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown  } from "react-icons/fa";
import { HiOutlineTrash } from 'react-icons/hi2';

import { Button } from '../common/CommonComponents';
import StickyNotesList from './StickyNotesList';

/**
 * @prop {string} noteColor - The color of the sticky notes [yellow (default), pink, green or blue]
 */
const StickyNoteGroup = ({
  group,
  stickyNotes,
  fetchNotesAndGroups,
  addNote,
  updateNote,
  deleteNote,
  collapsed = false,
  isDefault = false
}) => {
  const [groupCollapsed, setGroupCollapsed] = useState(collapsed);
  const [groupID, setGroupID] = useState(group.id);

  const deleteGroup = async () => {
    const groupDeleteResponse = await fetch(`/api/stickyNoteGroups/${groupID}`, {
      method: 'DELETE'
    });

    // Loop through all sticky notes and delete notes associated with deleted group
    stickyNotes.map(async (note) => {
      if (note.group === groupID) {
        const stickyNotesFromGroupDeleteResponse = await fetch(`/api/stickynotes/${note.id}`, {
          method: 'DELETE'
        });
      }
    })

    fetchNotesAndGroups();
    return;
  }

  return (
    <div className={`sticky-notes-group ${group.color}`} id={groupID}>
      <div className={`group-header ${groupCollapsed ? 'collapsed' : ''}`}>
          <div className="group-title">
            <div onClick={() => {setGroupCollapsed((state) => !state)}} className="toggle-group-collapsible">
              {groupCollapsed ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {group.title}
          </div>

          {!isDefault && <Button className='delete-group mini' children={<HiOutlineTrash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>}
      </div>

      {groupCollapsed && <StickyNotesList stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />}
    </div>
  )
}

export default StickyNoteGroup