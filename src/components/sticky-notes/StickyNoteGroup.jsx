import React, { useEffect, useState } from 'react';

import { Button } from '../CommonComponents';
import { ChevronDown, ChevronRight, Trash } from '../Icons';

import database from '../../database/database';
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
      const result = await database.select('SELECT notes.* FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1', [group.id]);
      setNotes(result);
    } catch(error) {
      console.log(`Error while retrieving notes for group with ID '${group.id}'`, error);
    }
  }

  const deleteGroup = async () => {
    try {
      const deleteGroupNotes = await database.execute('DELETE FROM notes WHERE group_id IN (SELECT group_id FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1)', [group.id]);
      const deleteGroup = await database.execute('DELETE FROM note_groups WHERE id = $1', [group.id]);

      getGroups();
    } catch(error) {
      console.log(`Error while deleting group with ID '${group.id}'`, error);
    }
  }

  const addNote = async (newNote) => {
    try {
      const noteCompleted = (newNote.completed) ?  1 : 0;

      const result = await database.execute('INSERT INTO notes (content, completed, group_id) VALUES ($1, $2, $3)', [newNote.content, noteCompleted, newNote.group_id]);
      getNotesForGroup();
    } catch(error) {
      console.log('Error while creating new note', error);
    }
  }

  const updateNote = async (note) => {
    try {
      const noteCompleted = (note.completed) ?  1 : 0;
      const result = await database.execute('UPDATE notes SET content = $1, completed = $2, edited_timestamp = $3 WHERE id = $4', [note.content, noteCompleted, note.dateTimeEdited, note.id]);
      console.log(result);

      getNotesForGroup();
    } catch(error) {
      console.log(`Error while updating note with ID '${note.id}'`, error);
    }
  }

  const deleteNote = async (id) => {
    try {
      const result = await database.execute('DELETE FROM notes WHERE id = $1', [id]);
      getNotesForGroup();
    } catch(error) {
      console.log(`Error while deleting note with ID '${id}'`, error);
    }
  }

  useEffect(() => {
    getNotesForGroup();
  }, [])

  return (
    <div className={`sticky-notes-group ${group.color}`} id={group.id}>
      <div className={`group-header ${groupCollapsed ? 'collapsed' : ''}`}>
          <div className="group-title">
            <div style={{fontSize: '1.2rem'}} onClick={() => {setGroupCollapsed((state) => !state)}} className="toggle-group-collapsible">
              {groupCollapsed ? <ChevronDown /> : <ChevronRight />}
            </div>
            {group.title}
          </div>

          {!isDefault && <Button className='delete-group mini' children={<Trash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>}
      </div>

      {/* {groupCollapsed && <StickyNotesList stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />} */}
      {groupCollapsed && <StickyNotesList stickyNotes={notes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />}
    </div>
  )
}

export default StickyNoteGroup