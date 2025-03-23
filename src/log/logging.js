import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';

/**
 * Function to bind an identified console logging function to a corresponding `@tauri-apps/plugin-log` log function
 * Overload of browsers `console` object to print console messages and additionally forward the same message to the `@tauri-apps/plugin-log` log function.
 * @param {*} consoleFunction - Name of the console logging level function
 * @param {*} tauriLoggerFunction - The function name of the corresponding tauri log function
 */
function forwardConsole(consoleFunction, tauriLoggerFunction) {
  const originalConsoleFunction = console[consoleFunction];

  console[consoleFunction] = (message) => {
    originalConsoleFunction(message);
    tauriLoggerFunction(message);
  };
}

// Binds the console logging functions of each level to the corresponding @tauri-apps/plugin-log function
export const bindLoggers = () => {
  try {
    forwardConsole('log', trace);
    forwardConsole('debug', debug);
    forwardConsole('info', info);
    forwardConsole('warn', warn);
    forwardConsole('error', error);

    info('console object and Tauri logger functions successfully bound');
  } catch(error) {
    error(`Error while attempting to bind console object and Tauri logger functions: ${error}`);
  }
}