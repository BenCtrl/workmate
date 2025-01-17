import React, { useState, useEffect, useContext } from 'react'

import '../../styling/noteslist.css'
import StickyNote from '../StickyNote'
import NewStickyNote from '../NewStickyNote';
import { AppSettingsContext } from '../../App';

const NotesList = () => {
  const [stickyNotes, setStickyNotes] = useState([]);
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const fetchStickyNotes = async () => {
      try {
          const response = await fetch('/api/stickynotes');
          const data = await response.json();
          setStickyNotes(data);
      } catch(error) {
          console.log('Error fetching data', error);
      }
    };

  const addNote = async (newNote) => {
    const response = await fetch('/api/stickynotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
    });

    fetchStickyNotes();
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

    fetchStickyNotes();
    return;
  }

  const deleteNote = async (id) => {
    const res = await fetch(`/api/stickynotes/${id}`, {
      method: 'DELETE'
    });

    fetchStickyNotes();
    return;
  }

  useEffect(() => {
    fetchStickyNotes();
  }, []);

  return (
    <>
      <div id='notes-list'>
        {stickyNotes.map((stickyNote) => {
          const stickyNoteComponent = <StickyNote key={stickyNote.id} stickyNote={stickyNote} updateNoteSubmit={updateNote} deleteNote={deleteNote} />;

          if (SETTINGS.HIDE_COMPLETED_NOTES) {
            if (!stickyNote.completed) {
              return stickyNoteComponent
            }
          } else {
            return stickyNoteComponent
          }
        })}
        <NewStickyNote addNoteSubmit={addNote}/>
      </div>
    </>
  )
}

export default NotesList