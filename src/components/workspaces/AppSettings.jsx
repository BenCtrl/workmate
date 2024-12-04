import React, { useState, useContext } from 'react'
import Button from '../Button';
import { AppSettingsContext } from '../../App';

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      TOOLTIPS: toolTipsEnabled
    }

    console.log(toolTipsEnabled);

    try {
      await fetch(`/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });

      setAppSettings(newSettings);
      console.log('Successfully updated app settings!');
    } catch(error) {
        console.log('Error while saving settings', error);
    }

    return;
  }

  return (
    <>
      <h1 style={{marginTop: 'unset'}}>Settings</h1>
      <form onSubmit={updateSettings}>
        <fieldset>
          <legend>Accessibility</legend>
          <div>
            <input type="checkbox" id="toggle-tooltips" name="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
            <label htmlFor="toggle-tooltips">Tooltips</label>
          </div>
        </fieldset>
        <Button style={{margin: '12px 0'}} children={'Save'} />
      </form>
    </>
  )
}

export default AppSettings