import React, { useState, useContext } from 'react'
import Button from '../Button';
import { AppSettingsContext } from '../../App';
import Alert from '../Alert';
import CheckBoxSlider from '../CheckBoxSlider';
import '../../styling/appsettings.css'

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);
  const [darkModeEnabled, setDarkModeEnabled] = useState(appSettings.DARKMODE);
  const [wordCounterEnabled, setWordCounterEnabled] = useState(appSettings.WORD_COUNTER);
  const [changesMade, setChangesMade] = useState(false);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      TOOLTIPS: toolTipsEnabled,
      DARKMODE: darkModeEnabled,
      WORD_COUNTER: wordCounterEnabled
    }

    try {
      await fetch(`/api/settings`, {
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
      <form onSubmit={updateSettings} onChange={() => {!changesMade && setChangesMade(!changesMade)}}>
        <fieldset>
          <legend>Accessibility</legend>
          <CheckBoxSlider labelContent="Tooltips" checkBoxID="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Dark Mode" checkBoxID="toggle-darkmode" checked={darkModeEnabled} onChange={() => {setDarkModeEnabled((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Page Editor</legend>
          <CheckBoxSlider labelContent="Word Counter" checkBoxID="toggle-page-editor-word-count" checked={wordCounterEnabled} onChange={() => {setWordCounterEnabled((state) => !state)}} />
        </fieldset>

        <Button style={{margin: '12px 0'}} children={'Save'} disabled={!changesMade}/>
        {changesMade && <Alert alertType="warning" message="Unsaved Changes!" />}
      </form>
    </>
  )
}

export default AppSettings