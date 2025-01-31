import Database from 'better-sqlite3';
import express from 'express';
import noteRoutes from './routes/notes.js';
import noteGroups from './routes/note_groups.js';
import pageRoutes from './routes/pages.js'
import eventRoutes from './routes/events.js'
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import fs from 'fs';

const server = express();
const port = 8080;

const database = new Database('workmate.db', {});

server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(logger);

server.use('/api/stickynotes', noteRoutes);
server.use('/api/stickynote_groups', noteGroups);
server.use('/api/pages', pageRoutes);
server.use('/api/events', eventRoutes);

server.get('/api/app_settings', (request, response) => {
  fs.readFile('./src/app_settings.json', 'utf8', (error, data) => {
    if (error) {
      response.status(500).send(error);
      return;
    }

    const app_data = JSON.parse(data)
    response.send(app_data.settings);
  });
})

server.put('/api/app_settings', (request, response) => {
  const app_settings = request.body;

  fs.writeFile('./src/app_settings.json', JSON.stringify(app_settings), 'utf8', (error) => {
    if (error) {
      response.status(500).send(error);
      return;
    }
    response.send('Data updated successfully');
  });
});


server.use(errorHandler);

server.listen(port, () => console.log(`Server is running on port ${port}`));

export default database;