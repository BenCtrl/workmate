import React, { useEffect, useRef, useState } from 'react';
import { HiXMark } from "react-icons/hi2";
import { FaRegFloppyDisk } from "react-icons/fa6";

import { Button } from '../CommonComponents';

const StickyNoteEditor = ({noteSubmit, editorEnabled, existingStickyNote, groupID}) => {
  const textAreaRef = useRef(null);

  const [id, setId] = useState(null);
  const [stickyNoteContent, setStickyNoteContent] = useState('');
  const [noteCompleted, setNoteCompleted] = useState(false);

  useEffect(() => {
    textAreaRef.current.focus();

    if(existingStickyNote) {
      setId(existingStickyNote.id);
      setStickyNoteContent(existingStickyNote.content);
      setNoteCompleted(existingStickyNote.completed);
    }
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
  
    const newNote = id ? {
      id,
      content: stickyNoteContent,
      completed: noteCompleted,
      dateTimeCreated: existingStickyNote.dateTimeCreated,
      dateTimeEdited: Date.now(),
      group_id: groupID
    } : {
      content: stickyNoteContent,
      completed: noteCompleted,
      dateTimeCreated: Date.now(),
      dateTimeEdited: Date.now(),
      group_id: groupID
    }

    noteSubmit(newNote);
    editorEnabled((state) => !state); 
    setStickyNoteContent('');
  }

  return (
    <form onSubmit={submitForm}>
      <textarea 
        ref={textAreaRef} 
        value={stickyNoteContent}
        maxLength={127} // TODO - Move this verification to client side
        onChange={(changeEvent) => setStickyNoteContent(changeEvent.target.value)}
        onKeyDown={(keyEvent) => {
          keyEvent.code === "Escape" && editorEnabled((state) => !state);
        }} 
        className='new-note-input'
      />
      <div className="sticky-note-editing-controls">
        <Button children={<HiXMark />} onClick={() => {editorEnabled((state) => !state); setStickyNoteContent('')}} toolTip={'Cancel note changes'}/>
        <Button children={<FaRegFloppyDisk />} type="submit" toolTip={'Save note changes'}/>
      </div>
    </form>
  )
}

export default StickyNoteEditor