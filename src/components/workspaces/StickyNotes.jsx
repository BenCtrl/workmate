import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { HiOutlineRectangleStack } from "react-icons/hi2";

import { Button, Modal } from '../common/CommonComponents'
import NewStickyNotesGroupModal from '../sticky-notes/NewStickyNotesGroupModal';
import StickyNoteGroup from '../sticky-notes/StickyNoteGroup';
import '../../styling/noteslist.css'

const NotesList = () => {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const fetchNotesAndGroups = async () => {
    fetchStickyNotes();
    fetchGroups();
  };

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

  const fetchGroups = async () => {
    try {
        const response = await fetch('/api/stickyNoteGroups');
        const data = await response.json();
        setGroups(data);
    } catch(error) {
        console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchNotesAndGroups();
  }, []);

  return (
    <>
      <div className='sticky-notes-controls'>
        <Button children={<HiOutlineRectangleStack />} toolTip={'Create new group'} onClick={() => {setShowGroupModal((state) => !state)}} />
      </div>
      <div id="notes-list-wrapper">
        {/* Default group that will always be present and cannot be deleted */}
        <StickyNoteGroup group={{title: 'Sticky Notes', color: 'yellow', id: 0}} stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} collapsed={true} isDefault={true} />
        {groups.map((group) => {
          return <StickyNoteGroup key={group.id} fetchNotesAndGroups={fetchNotesAndGroups} group={group} stickyNotes={stickyNotes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} />
        })}
      </div>

      {showGroupModal &&
        createPortal(
          <Modal children={<NewStickyNotesGroupModal onNewGroupSubmit={fetchGroups} />} onClose={() => setShowGroupModal(false)} modalHeading={'New Notes Group'}/>,
          document.body
        )
      }
    </>
  )
}

export default NotesList;