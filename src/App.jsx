import { createContext, useEffect, useState } from "react"
import { create, exists, BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import NavBar from "./components/core/NavBar"
import WorkSpace from "./components/core/WorkSpace"
import './styling/shared.css'
import TitleBar from "./components/core/TitleBar";

export const AppSettingsContext = createContext(null);

function App() {
  const [appSettings, setAppSettings] = useState({});

  const fetchAppSettings = async () => {
    try {
      const appDataDirectory = {baseDir: BaseDirectory.AppData};

      // Create app settings.json file with default settings if it does not exist
      if (!await exists('app_settings.json', appDataDirectory)) {
        const file = await create('app_settings.json', appDataDirectory);
        await file.write(new TextEncoder().encode(JSON.stringify({
          "TOOLTIPS":false,
          "DARKMODE":false,
          "WORD_COUNTER":false,
          "HIDE_COMPLETED_NOTES":false
        })));
        await file.close();
      }

      const settings = await readTextFile('app_settings.json', appDataDirectory);
      setAppSettings(JSON.parse(settings));
    } catch(error) {
      console.log('Error retrieving app settings', error);
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
      <NavBar />
      <WorkSpace />
    </AppSettingsContext.Provider>
  )
}

export default App
