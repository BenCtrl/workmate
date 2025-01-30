// import database from '../server.js';
import Database from "better-sqlite3";
const database = new Database('workmate.db', {});

const parseToBoolean = (sqlValue) => {
  return (sqlValue < 1) ? false : true;
};

export const getNotes = (request, response, nextMiddleWare) => {
  try {
    let notes = [];
    const groupID = parseInt(request.query.group_id);

    if (!isNaN(groupID)) {
      notes = database.prepare('SELECT notes.* FROM notes INNER JOIN note_groups ON notes.group_id = note_groups.id WHERE note_groups.id = ?;').all(groupID);
    } else {
      notes = database.prepare('SELECT * FROM notes;').all();
    }

    notes.map((note) => {
      note.completed = parseToBoolean(note.completed);
    });

    response.json(notes);
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const getNote = (request, response, nextMiddleWare) => {
  try {
    const noteID = request.params.id;
    const note = database.prepare('SELECT * FROM notes WHERE id = ?').get(noteID);

    note.completed = parseToBoolean(note.completed);

    response.status(200).json(note);
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const createNote = (request, response, nextMiddleWare) => {
  try {
    console.log(request.body);
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ?  1 : 0;
    const noteGroupID = request.body.group_id;

    const preparedStatement = database.prepare('INSERT INTO notes (content, completed, group_id) VALUES (?, ?, ?)');

    response.status(201).json(preparedStatement.run(noteContent, noteCompleted, noteGroupID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const updateNote = (request, response, nextMiddleWare) => {
  try {
    const noteID = request.params.id;
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ? 1 : 0;
    const noteEditedTimstamp = request.body.dateTimeEdited;

    const preparedStatement = database.prepare('UPDATE notes SET content = ?, completed = ?, edited_timestamp = ? WHERE id = ?');

    console.log(`${noteContent} ${noteID}`);

    response.status(204).json(preparedStatement.run(noteContent, noteCompleted, noteEditedTimstamp, noteID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const deleteNote = (request, response, nextMiddleWare) => {
  try {
    const noteID = request.params.id;
    const preparedStatement = database.prepare('DELETE FROM notes WHERE id = ?');

    response.status(200).json(preparedStatement.run(noteID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}