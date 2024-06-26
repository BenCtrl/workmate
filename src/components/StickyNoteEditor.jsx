import React, { useEffect, useRef, useState } from 'react'
import { HiXMark } from "react-icons/hi2";
import { FaRegFloppyDisk } from "react-icons/fa6";
import Button from './Button';

const StickyNoteEditor = ({noteSubmit, editorEnabled, existingStickyNote}) => {
  const textAreaRef = useRef(null);

  const [id, setId] = useState(null);
  const [stickyNoteContent, setStickyNoteContent] = useState('');

  useEffect(() => {
    textAreaRef.current.focus();

    if(existingStickyNote) {
      setId(existingStickyNote.id);
      setStickyNoteContent(existingStickyNote.noteContent);
    }
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
  
    const newNote = id ? {
      id,
      noteContent: stickyNoteContent
    } : {noteContent: stickyNoteContent}

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
        <Button children={<HiXMark />} onClick={() => {editorEnabled((state) => !state); setStickyNoteContent('')}} className={'cancel'}/>
        <Button children={<FaRegFloppyDisk />} type="submit" className={'confirm'}/>
      </div>
    </form>
  )
}

export default StickyNoteEditor