import React, { useState, useContext } from 'react'
import Button from './Button';
import { AppConfigurationContext } from '../context/AppConfigurationContext';

const AppSettings = () => {
  const configurationContext = useContext(AppConfigurationContext);
  const [toolTipsEnabled, setTooltipsEnabled] = useState(configurationContext.TOOLTIPS);

  const updateSettings = async (event) => {
    try {
      await fetch(`/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          TOOLTIPS: toolTipsEnabled
        })
      });

      console.log('Successfully updated app settings!');
    } catch(error) {
        console.log('Error while saving settings', error);
    }

    return;
  }

  return (
    <>
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