import Database from "better-sqlite3";
const database = new Database('workmate.db', {});

export const getPages = (request, response, nextMiddleWare) => {
  try {
    response.json(database.prepare('SELECT * FROM pages;').all());
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const getPage = (request, response, nextMiddleWare) => {
  try {
    const pageID = request.params.id;
    response.status(200).json(database.prepare('SELECT * FROM pages WHERE id = ?').get(pageID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const createPage = (request, response, nextMiddleWare) => {
  try {
    console.log(request.body);
    const pageTitle = request.body.title;
    const pageContent = request.body.page_content;

    const preparedStatement = database.prepare('INSERT INTO pages (title, page_content) VALUES (?, ?) RETURNING id');

    response.status(201).json(preparedStatement.get(pageTitle, pageContent));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const updatePage = (request, response, nextMiddleWare) => {
  try {
    const pageID = request.params.id;
    const pageTitle = request.body.title;
    const pageContent = request.body.page_content;
    const pageEditedTimeStamp = request.body.edited_timestamp;

    const preparedStatement = database.prepare('UPDATE pages SET title = ?, page_content = ?, edited_timestamp = ? WHERE id = ?');
    response.status(204).json(preparedStatement.run(pageTitle, pageContent, pageEditedTimeStamp, pageID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}

export const deletePage = (request, response, nextMiddleWare) => {
  try {
    const pageID = request.params.id;
    const preparedStatement = database.prepare('DELETE FROM pages WHERE id = ?');

    response.status(200).json(preparedStatement.run(pageID));
  } catch (error) {
    return nextMiddleWare(new Error(error));
  }
}