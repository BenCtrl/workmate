import Database from "better-sqlite3";
import { getLogger } from "../../logging/logging.js";

const database = new Database('workmate.db', {});
const apiLogger = getLogger('workmate_api');

export const getPages = (request, response, errorHandlerMiddleware) => {
  try {
    const pages = database.prepare('SELECT * FROM pages;').all();
    apiLogger.info('Successfully retrieved all pages');

    response.json(pages);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const getPage = (request, response, errorHandlerMiddleware) => {
  try {
    const pageID = request.params.id;
    const page = database.prepare('SELECT * FROM pages WHERE id = ?').get(pageID);
    apiLogger.info(`Successfully retrieved page with ID '${pageID}'`);

    response.status(200).json(page);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const createPage = (request, response, errorHandlerMiddleware) => {
  try {
    const pageTitle = request.body.title;
    const pageContent = request.body.page_content;

    const page = database.prepare('INSERT INTO pages (title, page_content) VALUES (?, ?) RETURNING id').get(pageTitle, pageContent);
    apiLogger.info(`Successfully created new page with ID '${page.id}'`);

    response.status(201).json(page);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const updatePage = (request, response, errorHandlerMiddleware) => {
  try {
    const pageID = request.params.id;
    const pageTitle = request.body.title;
    const pageContent = request.body.page_content;
    const pageEditedTimeStamp = request.body.edited_timestamp;

    const updatedPage = database.prepare('UPDATE pages SET title = ?, page_content = ?, edited_timestamp = ? WHERE id = ?').run(pageTitle, pageContent, pageEditedTimeStamp, pageID);
    apiLogger.info(`Successfully updated page with ID '${pageID}'`);

    response.status(204).json(updatedPage);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}

export const deletePage = (request, response, errorHandlerMiddleware) => {
  try {
    const pageID = request.params.id;
    const deletePage = database.prepare('DELETE FROM pages WHERE id = ?').run(pageID);
    apiLogger.info(`Successfully deleted page with ID '${pageID}'`);

    response.status(200).json(deletePage);
  } catch (error) {
    return errorHandlerMiddleware(new Error(error));
  }
}