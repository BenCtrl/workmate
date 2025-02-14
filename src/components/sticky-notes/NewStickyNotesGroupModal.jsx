import React, { useState, useContext } from 'react';
import { info, warn, error } from '@tauri-apps/plugin-log';

import database from '../../database/database';
import { Alert, Button, Input } from '../CommonComponents';
import { AppSettingsContext } from '../../App';

/**
 * * @prop {function} onNewGroupSubmit - Function to be called once the modal for has been submitted
 */
const NewStickyNotesGroupModal = ({ onNewGroupSubmit }) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;
  const [groupTitle, setGroupTitle] = useState('');
  const [groupColor, setGroupColor] = useState('yellow');

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, sertAlertType] = useState('');

  const addGroup = async (submitEvent) => {
    submitEvent.preventDefault();

    try {
      let finalGroupTitle = groupTitle;

      if (!groupTitle.trim()) {
        error('Note group cannot be created - Title is empty');
        handleIncomingAlert(true, 'Group title cannot be empty');
        return;
      } else if (await database.select('SELECT * FROM note_groups WHERE title = $1', [groupTitle]).then(result => {return result.length}) > 0) {
        if (SETTINGS.PREVENT_DUPLICATES) {
          error(`Note group cannot be created - Group with title '${groupTitle}' already exists`);
          handleIncomingAlert(true, `Group with title '${groupTitle}' already exists`);
          return;
        } else {
          finalGroupTitle = `${finalGroupTitle}-Copy`;
        }
      }

      const createNoteGroupResult = await database.select('INSERT INTO note_groups (title, color) VALUES ($1, $2) RETURNING id;', [finalGroupTitle, groupColor]);

      if (createNoteGroupResult.length > 0) {
        info(`Group '${finalGroupTitle}' was successfully created with ID '${createNoteGroupResult[0].id}'`);
        handleIncomingAlert(false, `Group '${finalGroupTitle}' successfully created`);
      } else {
        warn('Unable to validate if note group was created - No ID was returned');
      }

      onNewGroupSubmit();
    } catch(error) {
      console.error(`Error while creating new note group: ${error}`);
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