import React, { useState } from 'react';

import database from '../../database/database';
import { Alert, Button, Input } from '../CommonComponents';

/**
 * * @prop {function} onNewGroupSubmit - Function to be called once the modal for has been submitted
 */
const NewStickyNotesGroupModal = ({ onNewGroupSubmit }) => {
  const [groupTitle, setGroupTitle] = useState('');
  const [groupColor, setGroupColor] = useState('yellow');

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, sertAlertType] = useState('');

  const addGroup = async (submitEvent) => {
    submitEvent.preventDefault();

    if (!groupTitle) {
      handleIncomingAlert(true, 'Group title cannot be empty')
      return;
    } else if (await database.select('SELECT * FROM note_groups WHERE title = $1', [groupTitle]).then(result => {return result.length}) > 0) {
      handleIncomingAlert(true, `Group with title '${groupTitle}' already exists`);
      return;
    }

    try {
      const result = await database.execute('INSERT INTO note_groups (title, color) VALUES ($1, $2);', [groupTitle, groupColor]);
      handleIncomingAlert(false, `Group '${groupTitle}' successfully created`);
      onNewGroupSubmit();
    } catch(error) {
      console.log('Error while creating new note group', error);
    }
  }

  const handleIncomingAlert = (isError, errorMessage) => {
    isError ? sertAlertType('error') : sertAlertType('success');
    setErrorMessage(errorMessage);
    setShowAlert(true);
  }

  return (
    <form id="new-sticky-note-group-form" onSubmit={addGroup}>
      {showAlert && <Alert alertType={alertType} message={errorMessage} />}
      <div className="new-sticky-note-group-input modal-input">
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