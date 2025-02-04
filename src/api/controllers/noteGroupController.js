// import database from '../server.js';
import Database from "better-sqlite3";
import { getLogger } from "../../logging/logging.js";

const database = new Database('workmate.db', {});
const apiLogger = getLogger('workmate_api');

export const getNoteGroups = (request, response, errorHandlerMiddleware) => {
  try {
    const noteGroups = database.prepare('SELECT * FROM note_groups;').all();
    apiLogger.info(`Successfully retrieved all note groups`);

    response.json(noteGroups);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const getNoteGroup = (request, response, errorHandlerMiddleware) => {
  try {
    const groupID = request.params.id;
    const group = database.prepare('SELECT * FROM note_groups WHERE id = ?').get(groupID);
    apiLogger.info(`Successfully retrieved group with ID '${groupID}'`);

    response.status(200).json(group);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const createNoteGroup = (request, response, errorHandlerMiddleware) => {
  try {
    const noteGroupTitle = request.body.title;
    const noteGroupColor = request.body.color;

    const noteGroup = database.prepare('INSERT INTO note_groups (title, color) VALUES (?, ?)').run(noteGroupTitle, noteGroupColor);
    apiLogger.info('Successfully created new note group');

    response.status(201).json(noteGroup);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const deleteNoteGroup = (request, response, errorHandlerMiddleware) => {
  try {
    const noteGroupID = request.params.id;
    const deleteGroupAssociatedNotesPreparedStatement = database.prepare('DELETE FROM notes WHERE group_id IN (SELECT group_id FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = ?)');
    const deleteGroupPreparedStatement = database.prepare('DELETE FROM note_groups WHERE id = ?');

    const queryInfo = deleteGroupAssociatedNotesPreparedStatement.run(noteGroupID);
    apiLogger.info(`Successfully deleted '${queryInfo.changes}' notes associated to group with ID '${noteGroupID}'`);

    deleteGroupPreparedStatement.run(noteGroupID);
    apiLogger.info(`Successfully deleted group with ID '${noteGroupID}'`);

    response.status(200).json({});
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}