import React, { useState } from 'react';
import '../styling/stickynote.css';
import { HiMiniPlus } from "react-icons/hi2";
import StickyNoteEditor from './StickyNoteEditor';

const NewStickyNote = ({addNoteSubmit}) => {
  const [creatingNewNote, setCreatingNewNote] = useState(false);

  return (
    <>
      {
        creatingNewNote ?
          <div className='sticky-note new-sticky-note'>
            <StickyNoteEditor noteSubmit={addNoteSubmit} editorEnabled={setCreatingNewNote} />
          </div>
            :
          <div onClick={() => {setCreatingNewNote((state) => !state);}} className='sticky-note new-sticky-note'>
            <div className='backing' />
            <div className='new-note-icon'><HiMiniPlus/></div>
            <div className='content'>Create a new note...</div>
          </div>
      }
    </>
    
  )
}

export default NewStickyNote