import React, { useEffect, useRef, useState } from 'react'
import { HiXMark } from "react-icons/hi2";
import { FaRegFloppyDisk } from "react-icons/fa6";
import Button from './Button';

const StickyNoteEditor = ({noteSubmit, editorEnabled, existingStickyNote}) => {
  const textAreaRef = useRef(null);

  const [id, setId] = useState(null);
  const [stickyNoteContent, setStickyNoteContent] = useState('');
  const [noteCompleted, setNoteCompleted] = useState(false);

  useEffect(() => {
    textAreaRef.current.focus();

    if(existingStickyNote) {
      setId(existingStickyNote.id);
      setStickyNoteContent(existingStickyNote.noteContent);
      setNoteCompleted(existingStickyNote.completed);
    }
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
  
    const newNote = id ? {
      id,
      noteContent: stickyNoteContent,
      completed: noteCompleted
    } : {
      noteContent: stickyNoteContent,
      completed: noteCompleted
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
        <Button children={<HiXMark />} onClick={() => {editorEnabled((state) => !state); setStickyNoteContent('')}} className={'cancel'} toolTip={'Cancel'}/>
        <Button children={<FaRegFloppyDisk />} type="submit" className={'confirm'} toolTip={'Save'}/>
      </div>
    </form>
  )
}

export default StickyNoteEditor