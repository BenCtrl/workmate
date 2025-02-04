import Database from "better-sqlite3";
import { getLogger } from "../../logging/logging.js";

const database = new Database('workmate.db', {});
const apiLogger = getLogger('workmate_api');

export const getEvents = (request, response, errorHandlerMiddleware) => {
  try {
    const events = database.prepare('SELECT * FROM events;').all();
    apiLogger.info(`Successfully retrieved all '${events.length}' events`);

    response.status(200).json(events);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const getEvent = (request, response, errorHandlerMiddleware) => {
  try {
    const eventID = request.params.id;
    const event = database.prepare('SELECT * FROM events WHERE id = ?').get(eventID);
    apiLogger.info(`Successfully retrieved event with ID '${eventID}'`);

    response.status(200).json(event);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const createEvent = (request, response, errorHandlerMiddleware) => {
  try {
    console.log(request.body);
    const eventTitle = request.body.title;
    const eventTimestamp = request.body.event_timestamp;

    const event = database.prepare('INSERT INTO events (title, event_timestamp) VALUES (?, ?) RETURNING id').get(eventTitle, eventTimestamp);
    apiLogger.info(`Successfully created new event with ID '${event.id}'`);

    response.status(201).json(event);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const updateEvent = (request, response, errorHandlerMiddleware) => {
  try {
    const eventID = request.params.id;
    const eventTitle = request.body.title;
    const eventTimestamp = request.body.event_timestamp;

    const updatedEvent = database.prepare('UPDATE events SET title = ?, event_timestamp = ? WHERE id = ?').run(eventTitle, eventTimestamp, eventID);
    apiLogger.info(`Successfully updated event with ID '${eventID}'`);

    response.status(204).json(updatedEvent);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const deleteEvent = (request, response, errorHandlerMiddleware) => {
  try {
    const eventID = request.params.id;
    const deletedEvent = database.prepare('DELETE FROM events WHERE id = ?').run(eventID);
    apiLogger.info(`Successfully deleted event with ID '${eventID}'`);

    response.status(200).json(deletedEvent);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}