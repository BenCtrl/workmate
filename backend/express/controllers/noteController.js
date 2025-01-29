// import database from '../server.js';
import Database from "better-sqlite3";
const database = new Database('workmate.db', {});

const parseToBoolean = (sqlValue) => {
  return (sqlValue < 1) ? false : true;
};

export const getNotes = (request, response, nextMiddleWare) => {
  try {
    const notes = database.prepare('SELECT * FROM notes;').all();

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
    const noteId = request.params.id;
    const note = database.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);

    note.completed = parseToBoolean(note.completed);

    response.status(200).json(note);
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const createNote = (request, response, nextMiddleWare) => {
  try {
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ?  1 : 0;

    const preparedStatement = database.prepare('INSERT INTO notes (content, completed) VALUES (?, ?)');

    response.status(201).json(preparedStatement.run(noteContent, noteCompleted));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const updateNote = (request, response, nextMiddleWare) => {
  try {
    const noteId = request.params.id;
    const noteContent = request.body.content;
    const noteCompleted = (request.body.completed) ? 1 : 0;
    const noteEditedTimstamp = request.body.edited_timestamp;

    const preparedStatement = database.prepare('UPDATE notes SET content = ?, completed = ?, edited_timestamp = ? WHERE id = ?');

    console.log(`${noteContent} ${noteId}`);

    response.status(204).json(preparedStatement.run(noteContent, noteCompleted, noteEditedTimstamp, noteId));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const deleteNote = (request, response, nextMiddleWare) => {
  try {
    const noteId = request.params.id;
    const preparedStatement = database.prepare('DELETE FROM notes WHERE id = ?');

    response.status(200).json(preparedStatement.run(noteId));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}