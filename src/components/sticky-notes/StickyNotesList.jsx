import React, { useContext } from 'react';
import { debug } from '@tauri-apps/plugin-log';

import NewStickyNote from './NewStickyNote';
import StickyNote from './StickyNote';

import '../../styling/sitcky-notes-list.css';

import { AppSettingsContext } from '../../App';

const StickyNotesList = ({stickyNotes, addNote, updateNote, deleteNote, group}) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  return (
    <div className="sticky-notes-list" id='notes-list'>
        {stickyNotes.map((stickyNote) => {
          const stickyNoteComponent = <StickyNote key={stickyNote.id} groupID={group.id} stickyNote={stickyNote} updateNoteSubmit={updateNote} deleteNote={deleteNote} />;

          if (SETTINGS.HIDE_COMPLETED_NOTES) {
            if (!stickyNote.completed) {
              return stickyNoteComponent
            } else {
              debug(`Hiding note [ID: '${stickyNote.id}'] - Marked as complete`);
            }
          } else {
            return stickyNoteComponent
          }
        })}
        <NewStickyNote addNoteSubmit={addNote} groupID={group.id} />
      </div>
  )
}

export default StickyNotesList