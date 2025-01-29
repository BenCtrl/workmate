const logger = (request, response, nextMiddleware) => {
  console.log(`${request.method} | ${request.protocol}://${request.get('host')}${request.originalUrl}`);
  nextMiddleware();
}

export default logger;