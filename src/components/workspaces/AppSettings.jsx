import React, { useState, useContext } from 'react';

import { Alert, Button, CheckBoxSlider } from '../common/CommonComponents';
import { AppSettingsContext } from '../../App';
import '../../styling/appsettings.css';

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);
  const [darkModeEnabled, setDarkModeEnabled] = useState(appSettings.DARKMODE);
  const [wordCounterEnabled, setWordCounterEnabled] = useState(appSettings.WORD_COUNTER);
  const [hideCompletedNotes, setHideCompletedNotes] = useState(appSettings.HIDE_COMPLETED_NOTES);
  const [changesMade, setChangesMade] = useState(false);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      TOOLTIPS: toolTipsEnabled,
      DARKMODE: darkModeEnabled,
      WORD_COUNTER: wordCounterEnabled,
      HIDE_COMPLETED_NOTES: hideCompletedNotes
    }

    try {
      await fetch(`/api/app_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });

      setAppSettings(newSettings);
      setChangesMade(false);
      console.log('Successfully updated app settings!');
    } catch(error) {
        console.log('Error while saving settings', error);
    }

    return;
  }

  return (
    <>
      <h1>Settings</h1>
      <form id="app-settings-form" onSubmit={updateSettings} onChange={() => {!changesMade && setChangesMade(!changesMade)}}>
        <fieldset>
          <legend>Accessibility</legend>
          <CheckBoxSlider labelContent="Tooltips" checkBoxID="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Dark Mode" checkBoxID="toggle-darkmode" checked={darkModeEnabled} onChange={() => {setDarkModeEnabled((state) => !state)}} />
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