import { createContext, useEffect, useState } from "react"
import { BaseDirectory, create, exists, readTextFile } from "@tauri-apps/plugin-fs";
import { debug, info } from "@tauri-apps/plugin-log";

import WorkSpace from "./components/core/WorkSpace"
import TitleBar from "./components/core/TitleBar";

import './styling/shared.css'

// import { bindLoggers } from "./log/logging";

const appSettingsFileName = 'app_settings.json';
export const AppSettingsContext = createContext(null);
// bindLoggers();

function App() {
  const [appSettings, setAppSettings] = useState({});

  const fetchAppSettings = async () => {
    try {
      const appDataDirectory = {baseDir: BaseDirectory.AppData};

      // Create app settings.json file with default settings if it does not exist
      if (!await exists(appSettingsFileName, appDataDirectory)) {
        debug(`'${appSettingsFileName}' not found - attempting to generate new file`);

        const file = await create('app_settings.json', appDataDirectory);
        await file.write(new TextEncoder().encode(JSON.stringify({
          "CLOSE_MODAL_ON_SUBMIT": false,
          "CURRENT_TIME_ZONE_ENABLED": true,
          "CONFIRM_BEFORE_DELETE":true,
          "DARKMODE":false,
          "FULL_WIDTH_PAGE_EDITOR": false,
          "HIDE_COMPLETED_NOTES":false,
          "OPEN_PAGE_IN_EDIT_MODE": false,
          "PREVENT_DUPLICATES":true,
          "TOOLTIPS":true,
          "WORD_COUNTER":false,
        })));
        await file.close();

        debug(`Created new application settings file and written default settings to file '${appSettingsFileName}'`);
      }

      const settings = await readTextFile(appSettingsFileName, appDataDirectory);
      setAppSettings(JSON.parse(settings));

      info(`Successfully located ${appSettingsFileName} and retrieved application settings`)
    } catch(error) {
      error(`Error retrieving app settings: ${error}`);
    }
  }

  useEffect(() => {
    fetchAppSettings();
  }, []);

  return (
    <AppSettingsContext.Provider value={{
      appSettings,
      setAppSettings
    }}>
      <TitleBar />
      <WorkSpace />
    </AppSettingsContext.Provider>
  )
}

export default App
