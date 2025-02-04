import winston from "winston";
const { combine, timestamp, label, printf } = winston.format;

const logMessageFormat = printf(({ level, message, label, timestamp, stack }) => {
  const logMessage = `${timestamp} [${level.toLocaleUpperCase()}] | ${label} | ${message}`;
  return stack ? `${logMessage}\n${stack}` : logMessage;
});

export const rootLogger = winston.createLogger({
  level: "debug",
  format: combine(
    label({ label: 'Root Logger' }),
    timestamp(),
    logMessageFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'workmate.log', level: 'debug'})
  ]
});

winston.loggers.add('workmate_api', {
  level: "debug",
  format: combine(
    label({ label: 'workmate_api' }),
    timestamp(),
    logMessageFormat
  ),
  transports: [
    new winston.transports.Console({level: 'info'}),
    new winston.transports.File({filename: 'workmate.log', level: 'debug'})
  ]
});

export const getLogger = (loggerName) => {
  return winston.loggers.get(loggerName);
}
