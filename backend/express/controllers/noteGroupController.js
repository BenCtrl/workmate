// import database from '../server.js';
import Database from "better-sqlite3";
const database = new Database('workmate.db', {});

export const getNoteGroups = (request, response, nextMiddleWare) => {
  try {
    const noteGroups = database.prepare('SELECT * FROM note_groups;').all();
    response.json(noteGroups);
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const getNoteGroup = (request, response, nextMiddleWare) => {
  try {
    const groupID = request.params.id;
    const group = database.prepare('SELECT * FROM note_groups WHERE id = ?').get(groupID);

    response.status(200).json(group);
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const createNoteGroup = (request, response, nextMiddleWare) => {
  try {
    const noteGroupTitle = request.body.title;
    const noteGroupColor = request.body.color;

    const preparedStatement = database.prepare('INSERT INTO note_groups (title, color) VALUES (?, ?)');

    response.status(201).json(preparedStatement.run(noteGroupTitle, noteGroupColor));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const deleteNoteGroup = (request, response, nextMiddleWare) => {
  try {
    const noteGroupID = request.params.id;
    const deleteGroupAssociatedNotesPreparedStatement = database.prepare('DELETE FROM notes WHERE group_id IN (SELECT group_id FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = ?)');
    const deleteGroupPreparedStatement = database.prepare('DELETE FROM note_groups WHERE id = ?');

    deleteGroupAssociatedNotesPreparedStatement.run(noteGroupID);
    deleteGroupPreparedStatement.run(noteGroupID);
    response.status(200).json({});
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}