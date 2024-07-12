import { createContext } from "react";

const setConfigurationContext = async () => {
  try {
    const response = await fetch('/api/settings');
    return await response.json();
  } catch(error) {
    console.log('Error fetching data', error);
  }
}

export const AppConfigurationContext = createContext(await setConfigurationContext());