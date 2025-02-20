import React, { useContext, useState } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

import { Alert, Button, CheckBoxSlider } from '../CommonComponents';
import '../../styling/appsettings.css';

import { AppSettingsContext } from '../../App';

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);
  const [darkModeEnabled, setDarkModeEnabled] = useState(appSettings.DARKMODE);
  const [wordCounterEnabled, setWordCounterEnabled] = useState(appSettings.WORD_COUNTER);
  const [hideCompletedNotes, setHideCompletedNotes] = useState(appSettings.HIDE_COMPLETED_NOTES);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(appSettings.CONFIRM_BEFORE_DELETE);
  const [preventDuplicates, setPreventDuplicates] = useState(appSettings.PREVENT_DUPLICATES);
  const [changesMade, setChangesMade] = useState(false);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      TOOLTIPS: toolTipsEnabled,
      DARKMODE: darkModeEnabled,
      WORD_COUNTER: wordCounterEnabled,
      HIDE_COMPLETED_NOTES: hideCompletedNotes,
      CONFIRM_BEFORE_DELETE: confirmBeforeDelete,
      PREVENT_DUPLICATES: preventDuplicates
    }

    try {
      await writeTextFile('app_settings.json', JSON.stringify(newSettings), {baseDir: BaseDirectory.AppData});

      setAppSettings(newSettings);
      setChangesMade(false);

      info('Successfully updated application settings')
    } catch(error) {
        console.error(`Error while updating settings: ${error}`);
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <form id="app-settings-form" onSubmit={updateSettings} onChange={() => {!changesMade && setChangesMade(!changesMade)}}>
        <fieldset>
          <legend>General</legend>
          <CheckBoxSlider labelContent="Tooltips" checkBoxID="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Dark Mode" checkBoxID="toggle-darkmode" checked={darkModeEnabled} onChange={() => {setDarkModeEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Confirm before delete" checkBoxID="toggle-confirm-before-delete" checked={confirmBeforeDelete} onChange={() => {setConfirmBeforeDelete((state) => !state)}} />
          <CheckBoxSlider labelContent="Prevent duplicates" checkBoxID="toggle-prevent-duplicates" checked={preventDuplicates} onChange={() => {setPreventDuplicates((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Sticky Notes</legend>
          <CheckBoxSlider labelContent="Hide completed notes" checkBoxID="toggle-completed-sticky-note-archiving" checked={hideCompletedNotes} onChange={() => {setHideCompletedNotes((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Page Editor</legend>
          <CheckBoxSlider labelContent="Word Counter" checkBoxID="toggle-page-editor-word-count" checked={wordCounterEnabled} onChange={() => {setWordCounterEnabled((state) => !state)}} />
        </fieldset>

        {changesMade && <Alert alertType="warning" message="Unsaved Changes!" />}
        <Button id="app-settings-save" children={'Save'} disabled={!changesMade}/>
      </form>
    </>
  )
}

export default AppSettings