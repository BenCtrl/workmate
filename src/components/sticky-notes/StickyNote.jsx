import React, { useEffect, useState } from 'react';
import { HiOutlineTrash } from "react-icons/hi2";

import { Button, Checkbox } from '../CommonComponents';
import StickyNoteEditor from './StickyNoteEditor';
import '../../styling/stickynote.css';

const StickyNote = ({stickyNote, updateNoteSubmit, deleteNote, groupID}) => {
  const [updatingNote, setUpdatingNote] = useState(false);
  const [noteCompleted, setNoteCompleted] = useState(false);

  useEffect(() => {
    setNoteCompleted(stickyNote.completed);
  }, [])

  useEffect(() => {
    const newNote = {
      id: stickyNote.id,
      content: stickyNote.content,
      completed: noteCompleted,
      dateTimeCreated: stickyNote.dateTimeCreated,
      dateTimeEdited: Date.now(),
      group_id: groupID
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
            <div onClick={() => {setUpdatingNote((state) => !state);}} className='content'>{stickyNote.content}</div>

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