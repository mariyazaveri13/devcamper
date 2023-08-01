const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  //   error.message = err.message;

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    console.log(err.name);

    const message = `Resource not found for ID ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    console.log(err.code);
    const message = `Change Bootcamp name as it already exists`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose Validation error - the errors that come when required is mentioned
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
