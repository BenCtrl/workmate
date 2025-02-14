import React, { useContext } from 'react';
import { debug } from '@tauri-apps/plugin-log';

import { AppSettingsContext } from '../../App';
import StickyNote from './StickyNote';
import NewStickyNote from './NewStickyNote';
import '../../styling/noteslist.css';

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
              debug(`Hiding note with ID '${stickyNote.id}' - Marked as complete`);
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