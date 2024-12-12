import React, { useState } from 'react'
import '../styling/stickynote.css'
import { HiOutlineTrash } from "react-icons/hi2";
import StickyNoteEditor from './StickyNoteEditor';
import Button from './Button';

const StickyNote = ({stickyNote, updateNoteSubmit, deleteNote}) => {
  const [updatingNote, setUpdatingNote] = useState(false);

  return (
    <>
      {
        updatingNote ?
          <div className='sticky-note new-sticky-note'>
            <StickyNoteEditor noteSubmit={updateNoteSubmit} editorEnabled={setUpdatingNote} existingStickyNote={stickyNote} />
          </div>
            :
          <div onClick={() => {setUpdatingNote((state) => !state);}} className='sticky-note'>
            <div className='content'>{stickyNote.noteContent}</div>

            <div className='delete-note'>
              <Button children={<HiOutlineTrash />} onClick={() => {deleteNote(stickyNote.id)}} className={'cancel'} toolTip={'Delete Note'}/>
            </div>
          </div>
      }
    </>
  )
}

export default StickyNote