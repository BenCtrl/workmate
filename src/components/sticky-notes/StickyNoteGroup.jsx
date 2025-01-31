import React, { useEffect, useState } from 'react';
import { FaChevronRight, FaChevronDown  } from "react-icons/fa";
import { HiOutlineTrash } from 'react-icons/hi2';

import { Button } from '../common/CommonComponents';
import StickyNotesList from './StickyNotesList';

/**
 * @prop {string} noteColor - The color of the sticky notes [yellow (default), pink, green or blue]
 */
const StickyNoteGroup = ({
  group,
  getGroups,
  collapsed = false,
  isDefault = false
}) => {
  const [notes, setNotes] = useState([]);
  const [groupCollapsed, setGroupCollapsed] = useState(collapsed);

  const getNotesForGroup = async () => {
    try {
      const response = await fetch(`/api/stickynotes?group_id=${group.id}`);
      const data = await response.json();
      setNotes(data);
    } catch(error) {
        console.log('Error fetching data', error);
    }
  }

  const deleteGroup = async () => {
    const response = await fetch(`/api/stickynote_groups/${group.id}`, {
      method: 'DELETE'
    });

    getGroups();
    return;
  }

  const addNote = async (newNote) => {
    const response = await fetch('/api/stickynotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
    });

    getNotesForGroup();
    return;
  }

  const updateNote = async (note) => {
    const response = await fetch(`/api/stickynotes/${note.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    getNotesForGroup();
    return;
  }

  const deleteNote = async (id) => {
    const res = await fetch(`/api/stickynotes/${id}`, {
      method: 'DELETE'
    });

    getNotesForGroup();
    return;
  }

  useEffect(() => {
    console.log('group render');
    getNotesForGroup();
  }, [])

  return (
    <div className={`sticky-notes-group ${group.color}`} id={group.id}>
      <div className={`group-header ${groupCollapsed ? 'collapsed' : ''}`}>
          <div className="group-title">
            <div onClick={() => {setGroupCollapsed((state) => !state)}} className="toggle-group-collapsible">
              {groupCollapsed ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {group.title}
          </div>

          {!isDefault && <Button className='delete-group mini' children={<HiOutlineTrash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>}
      </div>

      {/* {groupCollapsed && <StickyNotesList stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />} */}
      {groupCollapsed && <StickyNotesList stickyNotes={notes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />}
    </div>
  )
}

export default StickyNoteGroup