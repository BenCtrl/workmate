import Database from "better-sqlite3";
import { getLogger } from "../../../src/features/logging/logging.js";

const database = new Database('workmate.db', {});
const apiLogger = getLogger('workmate_api');

const parseToBoolean = (sqlValue) => {
  return (sqlValue < 1) ? false : true;
};

export const getNotes = (request, response, errorHandlerMiddleware) => {
  try {
    let notes = [];
    const groupID = parseInt(request.query.group_id);

    apiLogger.debug('Attempting to prepare query to retrieve notes...')

    if (!isNaN(groupID)) {
      notes = database.prepare('SELECT notes.* FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = ?;').all(groupID);
      apiLogger.info(`Successfully retrieved ${notes.length} notes assigned to group with id '${groupID}'`);
    } else {
      notes = database.prepare('SELECT * FROM notes;').all();
      apiLogger.info(`Successfully retrieved ${notes.length} notes`);
    }

    notes.map((note) => {
      note.completed = parseToBoolean(note.completed);
    });

    response.json(notes);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const getNote = (request, response, errorHandlerMiddleware) => {
  try {
    const noteID = request.params.id;
    const note = database.prepare('SELECT * FROM notes WHERE id = ?').get(noteID);

    note.completed = parseToBoolean(note.completed);

    response.status(200).json(note);
    apiLogger.info(`Successfully retrieved note with ID of '${noteID}'`);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const createNote = (request, response, errorHandlerMiddleware) => {
  try {
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ?  1 : 0;
    const noteGroupID = request.body.group_id;

    if (!noteContent || noteContent.replace(/\s+/g, '') === '') {
      return errorHandlerMiddleware(new Error('Note content must not be empty'))
    }

    const preparedStatement = database.prepare('INSERT INTO notes (content, completed, group_id) VALUES (?, ?, ?)');

    response.status(201).json(preparedStatement.run(noteContent, noteCompleted, noteGroupID));
    apiLogger.info('Successfully created new note');
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export  const updateNote = (request, response, errorHandlerMiddleware) => {
  try {
    const noteID = request.params.id;
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ? 1 : 0;
    const noteEditedTimstamp = request.body.dateTimeEdited;

    const preparedStatement = database.prepare('UPDATE notes SET content = ?, completed = ?, edited_timestamp = ? WHERE id = ?');

    response.status(204).json(preparedStatement.run(noteContent, noteCompleted, noteEditedTimstamp, noteID));
    apiLogger.info(`Successfully updated note with ID '${noteID}'`);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const deleteNote = (request, response, errorHandlerMiddleware) => {
  try {
    const noteID = request.params.id;
    const preparedStatement = database.prepare('DELETE FROM notes WHERE id = ?');

    response.status(200).json(preparedStatement.run(noteID));
    apiLogger.info(`Successfully deleted note with ID '${noteID}'`);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}