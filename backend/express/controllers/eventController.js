import Database from "better-sqlite3";
const database = new Database('workmate.db', {});

export const getEvents = (request, response, nextMiddleWare) => {
  try {
    response.json(database.prepare('SELECT * FROM events;').all());
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const getEvent = (request, response, nextMiddleWare) => {
  try {
    const eventID = request.params.id;
    response.status(200).json(database.prepare('SELECT * FROM events WHERE id = ?').get(eventID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const createEvent = (request, response, nextMiddleWare) => {
  try {
    console.log(request.body);
    const eventTitle = request.body.title;
    const eventTimestamp = request.body.event_timestamp;

    const preparedStatement = database.prepare('INSERT INTO events (title, event_timestamp) VALUES (?, ?) RETURNING id');

    response.status(201).json(preparedStatement.get(eventTitle, eventTimestamp));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const updateEvent = (request, response, nextMiddleWare) => {
  try {
    const eventID = request.params.id;
    const eventTitle = request.body.title;
    const eventTimestamp = request.body.event_timestamp;

    const preparedStatement = database.prepare('UPDATE events SET title = ?, event_timestamp = ? WHERE id = ?');
    response.status(204).json(preparedStatement.run(eventTitle, eventTimestamp, eventID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const deleteEvent = (request, response, nextMiddleWare) => {
  try {
    const eventID = request.params.id;
    const preparedStatement = database.prepare('DELETE FROM events WHERE id = ?');

    response.status(200).json(preparedStatement.run(eventID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}