import Database from 'better-sqlite3';
import express from 'express';
import noteRoutes from './routes/notes.js';
import noteGroups from './routes/note_groups.js';
import pageRoutes from './routes/pages.js'
import eventRoutes from './routes/events.js'
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import fs from 'fs';
import { getLogger } from '../../src/features/logging/logging.js';

const server = express();
const port = 8080;

const database = new Database('workmate.db', {});
const apiLogger = getLogger('workmate_api');

server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(logger);

server.use('/api/stickynotes', noteRoutes);
server.use('/api/stickynote_groups', noteGroups);
server.use('/api/pages', pageRoutes);
server.use('/api/events', eventRoutes);

server.get('/api/app_settings', (request, response, errorHandlerMiddleware) => {
  fs.readFile('./src/app_settings.json', 'utf8', (error, data) => {
    if (error) {
      return errorHandlerMiddleware(new Error(error));
    }

    apiLogger.info('Successfully found and read app_settings file');
    response.status(200).send(JSON.parse(data));
  });
})

server.put('/api/app_settings', (request, response, errorHandlerMiddleware) => {
  const app_settings = request.body;

  fs.writeFile('./src/app_settings.json', JSON.stringify(app_settings), 'utf8', (error) => {
    if (error) {
      return errorHandlerMiddleware(new Error(error));
    }

    apiLogger.info('Successfully found and updated app_settings file')
    response.status(204).send('Data updated successfully');
  });
});


server.use(errorHandler);

server.listen(port, () => console.log(`Server is running on port ${port}`));

export default database;