import React, { useState } from 'react';

import { Checkbox, DeleteConfirmButton } from '../CommonComponents';
import { Trash } from '../Icons';

import StickyNoteEditor from './StickyNoteEditor';
import '../../styling/stickynote.css';

const StickyNote = ({stickyNote, updateNoteSubmit, deleteNote, groupID}) => {
  const [updatingNote, setUpdatingNote] = useState(false);
  const [noteCompleted, setNoteCompleted] = useState(stickyNote.completed);

  const updateNote = () => {
    const newNote = {
      id: stickyNote.id,
      content: stickyNote.content,
      completed: !noteCompleted,
      dateTimeCreated: stickyNote.dateTimeCreated,
      dateTimeEdited: Date.now(),
      group_id: groupID
    }

    updateNoteSubmit(newNote);
    setNoteCompleted((state) => !state);
  }

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

            <Checkbox className="outline note-completed-checkbox" onChange={() => {updateNote()}} checked={noteCompleted} toolTip={'Mark note as completed'} />
            <div className='delete-note'>
              <DeleteConfirmButton children={<Trash />} onClick={() => {deleteNote(stickyNote.id)}} toolTip={'Delete note'}/>
            </div>
          </div>
      }
    </>
  )
}

export default StickyNote