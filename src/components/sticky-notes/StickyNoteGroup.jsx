import React, { useEffect, useState } from 'react';
import { info, warn } from '@tauri-apps/plugin-log';

import { Button, ButtonGroup, DeleteConfirmButton } from '../CommonComponents';
import { ChevronDown, ChevronRight, Trash, X, Save } from '../Icons';

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
  const [groupTitle, setGroupTitle] = useState(group.title);
  const [updatingGroup, setUpdatingGroup] = useState(false);

  const getNotesForGroup = async () => {
    try {
      const notesForGroup = await database.select('SELECT notes.* FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1', [group.id]);

      if (notesForGroup.length > 0) {
        info(`Retrieved '${notesForGroup.length}' notes for note group with ID '${group.id}'`);
      } else {
        warn(`No notes returned for note group with ID '${group.id}'`);
      }

      setNotes(notesForGroup);
    } catch(error) {
      console.error(`Error while retrieving notes for group with ID '${group.id}': ${error}`);
    }
  }

  const updateGroup = async () => {
    try {
      await database.execute('UPDATE note_groups SET title = $1 WHERE id = $2', [groupTitle, group.id]);

      info(`Updated group '${groupTitle}' with ID '${group.id}'`);

      getGroups();
      setUpdatingGroup((state) => !state);
    } catch(error) {
      console.error(`Error while updating group with ID '${group.id}': ${error}`);
    }
  }

  const deleteGroup = async () => {
    try {
      const deleteNotesInGroup = await database.execute('DELETE FROM notes WHERE group_id IN (SELECT group_id FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1)', [group.id]);
      await database.execute('DELETE FROM note_groups WHERE id = $1', [group.id]);

      info(`Deleted note group with ID '${group.id}' and deleted '${deleteNotesInGroup.rowsAffected}' notes associated to note group`);
      getGroups();
    } catch(error) {
      console.error(`Error while deleting group with ID '${group.id}': ${error}`);
    }
  }

  const addNote = async (newNote) => {
    try {
      const noteCompleted = (newNote.completed) ?  1 : 0;
      const createNoteResult = await database.select('INSERT INTO notes (content, completed, group_id) VALUES ($1, $2, $3) RETURNING id;', [newNote.content, noteCompleted, newNote.group_id]);

      if (createNoteResult.length > 0) {
        info(`Created new note with ID '${createNoteResult[0].id}'`);
      } else {
        warn('Unable to validate if note was created - No ID was returned');
      }

      getNotesForGroup();
    } catch(error) {
      console.error(`Error while creating new note: ${error}`);
    }
  }

  const updateNote = async (note) => {
    try {
      const noteCompleted = (note.completed) ?  1 : 0;
      await database.execute('UPDATE notes SET content = $1, completed = $2, edited_timestamp = $3 WHERE id = $4', [note.content, noteCompleted, note.dateTimeEdited, note.id]);

      info(`Updated note with ID '${note.id}'`);
      getNotesForGroup();
    } catch(error) {
      console.error(`Error while updating note with ID '${note.id}': ${error}`);
    }
  }

  const deleteNote = async (id) => {
    try {
      await database.execute('DELETE FROM notes WHERE id = $1', [id]);

      info(`Deleted note with ID '${id}'`);
      getNotesForGroup();
    } catch(error) {
      console.error(`Error while deleting note with ID '${id}': ${error}`);
    }
  }

  useEffect(() => {
    getNotesForGroup();
  }, [])

  return (
    <div className={`sticky-notes-group ${group.color}`} id={group.id}>
      <div className={`group-header ${groupCollapsed ? 'collapsed' : ''} ${updatingGroup ? 'updating' : ''}`}>
          <div className="group-title">
            <div style={{fontSize: '1.2rem'}} onClick={() => {setGroupCollapsed((state) => !state)}} className="toggle-group-collapsible">
              {groupCollapsed ? <ChevronDown /> : <ChevronRight />}
            </div>
            {updatingGroup && !isDefault ?
              <input
                className='inline-title-input'
                style={{fontWeight:'bold'}}
                autoFocus
                value={groupTitle}
                onChange={(changeEvent) => {setGroupTitle(changeEvent.target.value)}}
                type='text'
                onKeyDown={(keyEvent) => {
                  if (keyEvent.code === "Escape") {
                    setUpdatingGroup((state) => !state);
                    setGroupTitle(group.title);
                  }

                  keyEvent.code === "Enter" && updateGroup();
                }}
              />
            :
              <span style={{flexGrow:'1'}} title={!isDefault && "Edit group title"} onClick={() => {!isDefault && setUpdatingGroup((state) => !state)}}>{group.title}</span>
            }
          </div>

          {/* {!isDefault && <DeleteConfirmButton className='delete-group mini' children={<Trash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>} */}
          {updatingGroup ?
            <ButtonGroup>
              <Button className='mini' onClick={() => {setUpdatingGroup((state) => !state)}} children={<X />} toolTip="Cancel edit"/>
              <Button className='mini' onClick={() => {updateGroup()}} children={<Save />} toolTip="Save group"/>
            </ButtonGroup>
          :
            !isDefault &&
            <DeleteConfirmButton className='delete-group mini' children={<Trash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>
          }
      </div>

      {/* {groupCollapsed && <StickyNotesList stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />} */}
      {groupCollapsed && <StickyNotesList stickyNotes={notes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />}
    </div>
  )
}

export default StickyNoteGroup