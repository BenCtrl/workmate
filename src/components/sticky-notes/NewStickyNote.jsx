import React, { useState } from 'react';

import StickyNoteEditor from './StickyNoteEditor';
import { Plus } from '../Icons';
import '../../styling/stickynote.css';

const NewStickyNote = ({addNoteSubmit, groupID}) => {
  const [creatingNewNote, setCreatingNewNote] = useState(false);

  return (
    <>
      {
        creatingNewNote ?
          <div className='sticky-note new-sticky-note'>
            <StickyNoteEditor noteSubmit={addNoteSubmit} editorEnabled={setCreatingNewNote} groupID={groupID} />
          </div>
            :
          <div onClick={() => {setCreatingNewNote((state) => !state);}} className='sticky-note new-sticky-note'>
            <div className='backing' />
            <div className='new-note-icon'><Plus /></div>
            <div className='content'>Create a new note...</div>
          </div>
      }
    </>
    
  )
}

export default NewStickyNote