const errorHandler = (error, request, response, nextMiddleWare) => {
  response.status(error.status ? error.status : 500).json({error: error});
  console.log(error);
}

export default errorHandler;