import React, { useState } from 'react';

import StickyNoteEditor from './StickyNoteEditor';
import { IconPlus } from '../Icons';
import '../../styling/sticky-note.css';

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
            <div className='new-note-icon'><IconPlus /></div>
            <div className='content'>Create a new note...</div>
          </div>
      }
    </>
    
  )
}

export default NewStickyNote