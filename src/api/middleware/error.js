import { getLogger } from "../../logging/logging.js";

const apiLogger = getLogger('workmate_api');

const errorHandler = (error, request, response, nextMiddleWare) => {
  response.status(error.status ? error.status : 500).json({error: error});
  apiLogger.error(`Error while attempting '${request.method}' request to '${request.protocol}://${request.get('host')}${request.originalUrl}'`, error);
  nextMiddleWare();
}

export default errorHandler;