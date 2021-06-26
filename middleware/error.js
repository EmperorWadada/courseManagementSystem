const ErrorResponse = require("../util/erroResponse");


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // console log for the developer
  console.log(err);

  console.log("Name of err:" + err.name);

  //Mongoose bad formated id
  if (err.name === 'CastError') {
    const message = `Bootcamp with the id: ${err.value} not correctly formated`;
    error = new ErrorResponse(message, 404);
  }

  //Error for Duplicate bootcamp name
  if (err.code === 11000) {
    const message = `Bootcamp Already exist`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(message => message.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    sucess: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler;