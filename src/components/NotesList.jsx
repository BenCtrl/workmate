import React, { useState, useEffect, useRef } from 'react'
import Note from './Note'
import StickyNote from './StickyNote'
import NewStickyNote from './NewStickyNote';
import { HiCodeBracket, HiArrowPath } from "react-icons/hi2";
import '../styling/noteslist.css'
import Button from './Button';

const NotesList = () => {
  const [stickyNotes, setStickyNotes] = useState([]);

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
      <div className="workspace-navbar">
        <div>Sticky Notes</div>
        <Button children={<HiArrowPath className='refresh' />} onClick={() => {fetchStickyNotes()}} toolTip={'Refresh Sticky Notes'} toolTipPos={'left'} />
      </div>
      <div id='notes-list'>
        {stickyNotes.map((stickyNote) => {
          return <StickyNote key={stickyNote.id} stickyNote={stickyNote} updateNoteSubmit={updateNote} deleteNote={deleteNote} />
        })}
        <NewStickyNote addNoteSubmit={addNote}/>
      </div>
    </>
  )
}

export default NotesList