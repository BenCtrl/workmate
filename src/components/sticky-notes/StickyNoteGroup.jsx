import React, { useContext, useEffect, useState } from 'react';
import { error, info, warn } from '@tauri-apps/plugin-log';
import { toast } from 'react-toastify';

import { Button, ButtonGroup, DeleteConfirmButton } from '../CommonComponents';
import StickyNotesList from './StickyNotesList';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconSave, IconTrash, IconX } from '../Icons';

import database from '../../database/database';
import { AppSettingsContext } from '../../App';

/**
 * @prop {string} noteColor - The color of the sticky notes [yellow (default), pink, green or blue]
 */
const StickyNoteGroup = ({
  group,
  getGroups,
  expanded = false,
  isDefault = false
}) => {
  const [notes, setNotes] = useState([]);
  const [groupExpanded, setGroupExpanded] = useState(expanded);
  const [groupTitle, setGroupTitle] = useState(group.title);
  const [groupColor, setGroupColor] = useState(group.color);

  const [updatingGroup, setUpdatingGroup] = useState(false);
  const [updatingColor, setUpdatingColor] = useState(false);

  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const getNotesForGroup = async () => {
    try {
      const notesForGroup = await database.select('SELECT notes.* FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1', [group.id]);

      if (notesForGroup.length > 0) {
        info(`Retrieved '${notesForGroup.length}' notes for note group '${groupTitle}' [ID: '${group.id}']`);
      } else {
        warn(`No notes returned for note group '${groupTitle}' [ID: '${group.id}']`);
      }

      setNotes(notesForGroup);
    } catch(error) {
      console.error(`Error while retrieving notes for group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const updateGroup = async () => {
    try {
      if (!groupTitle.trim()) {
        error('Note group cannot be updated - Title is empty');
        toast.error('Group title cannot be empty')
        return;
      } else if (await database.select('SELECT * FROM note_groups WHERE title = $1', [groupTitle]).then(result => {return result.length}) > 0) {
        if (SETTINGS.PREVENT_DUPLICATES) {
          error(`Note group cannot be updated - Group with title '${groupTitle}' already exists`);
          toast.error(`Group with title '${groupTitle}' already exists`)
          return;
        }
      }

      await database.execute('UPDATE note_groups SET title = $1 WHERE id = $2', [groupTitle, group.id]);

      info(`Updated group '${groupTitle}' [ID: '${group.id}']`);

      getGroups();
      setUpdatingGroup((state) => !state);
    } catch(error) {
      console.error(`Error while updating group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const updateGroupColor = async (color) => {
    try {
      await database.execute('UPDATE note_groups SET color = $1 WHERE id = $2', [color, group.id]);

      info(`Updated group '${groupTitle}' [ID: ${group.id}] color to '${color}'`);
      setGroupColor(color);

      getGroups();
    } catch(error) {
      console.error(`Error while updating group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const deleteGroup = async () => {
    try {
      const deleteNotesInGroup = await database.execute('DELETE FROM notes WHERE group_id IN (SELECT group_id FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = $1)', [group.id]);
      await database.execute('DELETE FROM note_groups WHERE id = $1', [group.id]);

      info(`Deleted note group '${groupTitle}' [ID: '${group.id}'] and deleted '${deleteNotesInGroup.rowsAffected}' notes associated to note group`);
      getGroups();
    } catch(error) {
      console.error(`Error while deleting group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const addNote = async (newNote) => {
    try {
      const noteCompleted = (newNote.completed) ?  1 : 0;
      const createNoteResult = await database.select('INSERT INTO notes (content, completed, group_id) VALUES ($1, $2, $3) RETURNING id;', [newNote.content, noteCompleted, newNote.group_id]);

      if (createNoteResult.length > 0) {
        info(`Created new note [Note ID: '${createNoteResult[0].id}'] in group '${groupTitle}' [ID: '${group.id}']`);
      } else {
        warn('Unable to validate if note was created - No ID was returned');
      }

      getNotesForGroup();
    } catch(error) {
      console.error(`Error while creating new note in group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const updateNote = async (note) => {
    try {
      const noteCompleted = (note.completed) ?  1 : 0;
      await database.execute('UPDATE notes SET content = $1, completed = $2, edited_timestamp = $3 WHERE id = $4', [note.content, noteCompleted, note.dateTimeEdited, note.id]);

      info(`Updated note [Note ID: '${note.id}'] in note group '${groupTitle}' [ID: '${group.id}']`);
      getNotesForGroup();
    } catch(error) {
      console.error(`Error while updating note [Note ID: '${note.id}'] in note group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const deleteNote = async (id) => {
    try {
      await database.execute('DELETE FROM notes WHERE id = $1', [id]);

      info(`Deleted note [Note ID: '${id}'] from note group '${groupTitle}' [ID: '${group.id}']`);
      getNotesForGroup();
    } catch(error) {
      console.error(`Error while deleting note [Note ID: '${id}'] from note group '${groupTitle}' [ID: '${group.id}']: ${error}`);
    }
  }

  const cancelTitleEdits = () => {
    setUpdatingGroup((state) => !state);
    setGroupTitle(group.title);
  }

  useEffect(() => {
    getNotesForGroup();
  }, [])

  return (
    <div className={`sticky-note-group ${groupColor} ${isDefault?'default':''}`} id={group.id}>
      <div className={`group-header ${groupExpanded ? 'expanded' : ''}`}>
          <div title={`${SETTINGS.TOOLTIPS ? 'Change group color':''}`} className={`group-color ${updatingColor && 'visible'}`} onClick={() => {setUpdatingColor((state) => !state);}}>
            {updatingColor &&
              <>
                <select value={groupColor} class="group-color-select" onChange={(changeEvent) => {updateGroupColor(changeEvent.target.value)}} onClick={(event) => {
                  event.stopPropagation();
                }} >
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
                <IconChevronLeft />
              </>
            }
          </div>
          <div className="group-title">
            <div onClick={() => {setGroupExpanded((state) => !state)}} className="toggle-group-collapsible">
              {groupExpanded ? <IconChevronDown /> : <IconChevronRight />}
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
                    cancelTitleEdits();
                  }

                  keyEvent.code === "Enter" && updateGroup();
                }}
              />
            :
              <span className="group-title-content" title={!isDefault ? "Edit group title":""} onClick={() => {!isDefault && setUpdatingGroup((state) => !state)}}>{group.title}{isDefault && <span className="group-title-detault-tag">(Default)</span>}</span>
            }
          </div>

          {updatingGroup ?
            <ButtonGroup>
              <Button className='mini' onClick={() => {cancelTitleEdits()}} children={<IconX />} toolTip="Cancel edit"/>
              <Button className='mini' onClick={() => {updateGroup()}} children={<IconSave />} toolTip="Save group"/>
            </ButtonGroup>
          :
            !isDefault &&
            <DeleteConfirmButton className='delete-group mini' children={<IconTrash />} onClick={() => {deleteGroup()}} toolTip={'Delete group'}/>
          }
      </div>

      {groupExpanded && <StickyNotesList stickyNotes={notes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} group={group} />}
    </div>
  )
}

export default StickyNoteGroup