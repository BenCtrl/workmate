import React, { useState } from 'react';

import { Button, Input } from '../common/CommonComponents';

/**
 * * @prop {function} onNewGroupSubmit - Function to be called once the modal for has been submitted
 */
const NewStickyNotesGroupModal = ({ onNewGroupSubmit }) => {
  const [groupTitle, setGroupTitle] = useState('');
  const [groupColor, setGroupColor] = useState('yellow');

  const addGroup = async (submitEvent) => {
    submitEvent.preventDefault();

    const newGroup = {
      title: groupTitle,
      color: groupColor
    }

    const response = await fetch('/api/stickyNoteGroups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGroup)
    });

    onNewGroupSubmit();
    return;
  }

  return (
    <form id="new-sticky-note-group-form" onSubmit={addGroup}>
      <div className="new-sticky-note-group-input">
        <Input name="new-sticky-note-group-title" id="new-sticky-note-group-title" placeholder='Title' value={groupTitle} onChange={(changeEvent) => {setGroupTitle(changeEvent.target.value)}} />
        <select value={groupColor} name="new-sticky-note-group-color" id="new-sticky-note-group-color" onChange={(changeEvent) => {setGroupColor(changeEvent.target.value)}}>
          <option value="yellow">Yellow</option>
          <option value="pink">Pink</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      <Button id="create-new-sticky-notes-group" children={'Create Group'} />
    </form>
  )
}

export default NewStickyNotesGroupModal