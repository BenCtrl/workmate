import { createContext, useEffect, useState } from "react"
import NavBar from "./components/core/NavBar"
import WorkSpace from "./components/core/WorkSpace"
import './styling/shared.css'

export const AppSettingsContext = createContext(null);

function App() {
  const [appSettings, setAppSettings] = useState({});

  const fetchAppSettings = async () => {
    try {
      const response = await fetch('/api/app_settings');
      const data = await response.json();
      setAppSettings(data);
    } catch(error) {
      console.log('Error fetching data', error);
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
      <NavBar />
      <WorkSpace />
    </AppSettingsContext.Provider>
  )
}

export default App
