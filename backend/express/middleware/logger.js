import { getLogger } from "../../../src/features/logging/logging.js";

const apiLogger = getLogger('workmate_api');

const logger = (request, response, nextMiddleware) => {
  apiLogger.info(`Incoming '${request.method}' request made to '${request.protocol}://${request.get('host')}${request.originalUrl}'`);
  nextMiddleware();
}

export default logger;