import React, { useEffect, useState } from 'react'
import '../styling/stickynote.css'
import { HiOutlineTrash } from "react-icons/hi2";
import StickyNoteEditor from './StickyNoteEditor';
import Button from './Button';
import Checkbox from './Checkbox';

const StickyNote = ({stickyNote, updateNoteSubmit, deleteNote, groupID}) => {
  const [updatingNote, setUpdatingNote] = useState(false);
  const [noteCompleted, setNoteCompleted] = useState(false);

  useEffect(() => {
    setNoteCompleted(stickyNote.completed);
  }, [])

  useEffect(() => {
    const newNote = {
      id: stickyNote.id,
      noteContent: stickyNote.noteContent,
      completed: noteCompleted,
      dateTimeCreated: stickyNote.dateTimeCreated,
      dateTimeEdited: Date.now(),
      group: groupID
    }

    updateNoteSubmit(newNote);
  }, [noteCompleted])

  return (
    <>
      {
        updatingNote ?
          <div className='sticky-note new-sticky-note'>
            <StickyNoteEditor noteSubmit={updateNoteSubmit} editorEnabled={setUpdatingNote} existingStickyNote={stickyNote} groupID={groupID} />
          </div>
            :
          <div className={`sticky-note ${noteCompleted && 'completed'}`}>
            <div onClick={() => {setUpdatingNote((state) => !state);}} className='content'>{stickyNote.noteContent}</div>

            <Checkbox className="outline note-completed-checkbox" onChange={() => {setNoteCompleted((state) => !state)}} checked={noteCompleted} toolTip={'Mark note as completed'} />
            <div className='delete-note'>
              <Button children={<HiOutlineTrash />} onClick={() => {deleteNote(stickyNote.id)}} toolTip={'Delete note'}/>
            </div>
          </div>
      }
    </>
  )
}

export default StickyNote