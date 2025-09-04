import React, { useContext, useState } from 'react';
import { error, info, warn } from '@tauri-apps/plugin-log';

import { Button, Input } from '../CommonComponents';

import { AppSettingsContext } from '../../App';
import { ModalContext } from '../common/Modal';
import database from '../../database/database';

/**
 * * @prop {function} onNewGroupSubmit - Function to be called once the modal for has been submitted
 */
const NewStickyNotesGroupModal = ({ onNewGroupSubmit }) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;
  const setAlert = useContext(ModalContext).setAlert;
  const closeModal = useContext(ModalContext).onClose;

  const [groupTitle, setGroupTitle] = useState('');
  const [groupColor, setGroupColor] = useState('yellow');

  const addGroup = async (submitEvent) => {
    submitEvent.preventDefault();

    try {
      let finalGroupTitle = groupTitle;

      if (!groupTitle.trim()) {
        error('Note group cannot be created - Title is empty');
        setAlert('error', 'Group title cannot be empty');
        return;
      } else if (await database.select('SELECT * FROM note_groups WHERE title = $1', [groupTitle]).then(result => {return result.length}) > 0) {
        if (SETTINGS.PREVENT_DUPLICATES) {
          error(`Note group cannot be created - Group with title '${groupTitle}' already exists`);
          setAlert('error', `Group with title '${groupTitle}' already exists`)
          return;
        } else {
          finalGroupTitle = `${finalGroupTitle}-Copy`;
        }
      }

      const createNoteGroupResult = await database.execute('INSERT INTO note_groups (title, color) VALUES ($1, $2);', [finalGroupTitle, groupColor]);

      if (createNoteGroupResult.rowsAffected > 0) {
        info(`Group '${finalGroupTitle}' was successfully created [ID: '${createNoteGroupResult.lastInsertId}']`);
        setAlert('success', `Group '${finalGroupTitle}' successfully created`);

        SETTINGS.CLOSE_MODAL_ON_SUBMIT && closeModal();
      } else {
        warn('Unable to validate if note group was created - No changes reported from database');
      }

      onNewGroupSubmit();
    } catch(error) {
      error(`Error while creating new note group: ${error}`);
    }
  }

  return (
    <form id="new-sticky-note-group-form" onSubmit={addGroup}>
      <div className="new-sticky-note-group-input modal-input-container">
        <div className="modal-input">
          <label htmlFor="new-sticky-note-group-title">Group Title</label>
          <Input
            name="new-sticky-note-group-title"
            id="new-sticky-note-group-title"
            placeholder='Title'
            value={groupTitle}
            onChange={(changeEvent) => {setGroupTitle(changeEvent.target.value)}}
            required={true}
          />
        </div>

        <div className="modal-input">
          <label htmlFor="new-sticky-note-group-color">Sticky Note Color</label>
          <select value={groupColor} name="new-sticky-note-group-color" id="new-sticky-note-group-color" onChange={(changeEvent) => {setGroupColor(changeEvent.target.value)}}>
            <option value="yellow">Yellow</option>
            <option value="pink">Pink</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </div>
      </div>

      <Button id="create-new-sticky-note-group" children={'Create Group'} />
    </form>
  )
}

export default NewStickyNotesGroupModal