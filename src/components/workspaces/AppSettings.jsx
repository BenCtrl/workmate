import React, { useState, useContext } from 'react'
import Button from '../Button';
import { AppSettingsContext } from '../../App';
import '../../styling/appsettings.css'

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);
  const [darkModeEnabled, setDarkModeEnabled] = useState(appSettings.DARKMODE);
  const [changesMade, setChangesMade] = useState(false);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      TOOLTIPS: toolTipsEnabled,
      DARKMODE: darkModeEnabled
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
          <div>
            <input type="checkbox" id="toggle-tooltips" name="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
            <label htmlFor="toggle-tooltips">Tooltips</label>
          </div>
          <div>
            <input type="checkbox" id="toggle-darkmode" name="toggle-tooltips" checked={darkModeEnabled} onChange={() => {setDarkModeEnabled((state) => !state)}} />
            <label htmlFor="toggle-tooltips">Darkmode</label>
          </div>
        </fieldset>
        <Button style={{margin: '12px 0'}} children={'Save'} disabled={!changesMade}/>
        {changesMade && <span class="unsaved-changes-message">Unsaved changes!</span>}
      </form>
    </>
  )
}

export default AppSettings