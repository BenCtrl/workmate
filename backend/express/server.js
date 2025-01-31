import Database from 'better-sqlite3';
import express from 'express';
import noteRoutes from './routes/notes.js';
import noteGroups from './routes/note_groups.js';
import pageRoutes from './routes/pages.js'
import eventRoutes from './routes/events.js'
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';

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

server.use(errorHandler);

server.listen(port, () => console.log(`Server is running on port ${port}`));

export default database;