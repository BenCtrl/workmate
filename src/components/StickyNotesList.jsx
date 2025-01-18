import React, { useContext } from 'react'

import '../styling/noteslist.css';
import StickyNote from '../components/StickyNote'
import NewStickyNote from '../components/NewStickyNote';
import { AppSettingsContext } from '../App';

const StickyNotesList = ({stickyNotes, addNote, updateNote, deleteNote, group}) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  return (
    <div className="sticky-notes-list" id='notes-list'>
        {stickyNotes.map((stickyNote) => {
          const stickyNoteComponent = <StickyNote key={stickyNote.id} groupID={group.id} stickyNote={stickyNote} updateNoteSubmit={updateNote} deleteNote={deleteNote} />;

          if (stickyNote.group !== group.id) {
            return;
          }

          if (SETTINGS.HIDE_COMPLETED_NOTES) {
            if (!stickyNote.completed) {
              return stickyNoteComponent
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