import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { error, debug, warn } from '@tauri-apps/plugin-log';

import { Button } from '../CommonComponents';
import { IconSave, IconX } from '../Icons';

const StickyNoteEditor = ({noteSubmit, editorEnabled, existingStickyNote, groupID}) => {
  const textAreaRef = useRef(null);

  const [id, setId] = useState(null);
  const [stickyNoteContent, setStickyNoteContent] = useState('');
  const [noteCompleted, setNoteCompleted] = useState(false);

  useEffect(() => {
    textAreaRef.current.focus();

    if(existingStickyNote) {
      debug(`Attempting to load existing content of note '${existingStickyNote.id}' into editor...`);

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

    if (!stickyNoteContent.trim()) {
      error('Note cannot be saved - Note content cannot be empty');
      toast.error('Note content cannot be empty');
      return;
    }

    noteSubmit(newNote);
    editorEnabled((state) => !state); 
    setStickyNoteContent('');
  }

  const processStickyNoteContent = (content) => {
    if (content.length > 126) {
      warn(`Character limit reached while editing note${id ? ` with ID '${id}'` : ''}`)
    } else if ((content.match(/\n/g)||[]).length > 6) {
      warn(`New line limit reached while editing note${id ? ` with ID '${id}'` : ''}`);
    } else {
      setStickyNoteContent(content);
    }
  }

  return (
    <form onSubmit={submitForm}>
      <textarea
        id='sticky-note-textarea'
        ref={textAreaRef} 
        value={stickyNoteContent}
        onChange={(changeEvent) => processStickyNoteContent(changeEvent.target.value)}
        onKeyDown={(keyEvent) => {
          keyEvent.code === "Escape" && editorEnabled((state) => !state);
        }} 
        className='new-note-input'
      />
      <div className="sticky-note-editing-controls">
        <Button children={<IconX />} onClick={() => {editorEnabled((state) => !state); setStickyNoteContent('')}} toolTip={'Cancel note changes'}/>
        <Button children={<IconSave />} type="submit" toolTip={'Save note changes'}/>
      </div>
    </form>
  )
}

export default StickyNoteEditor