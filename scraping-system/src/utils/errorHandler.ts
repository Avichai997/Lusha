import { Response, ErrorRequestHandler } from 'express';
import mongoose, { CastError } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError';
import { NODE_ENV } from './environment';
import { logger } from './logger';

// Handle CastError from MongoDB
const handleCastErrorDB = (error: CastError) => {
  const message = `Invalid value ${error.path}: ${error.value}.`;

  return new AppError(message, StatusCodes.BAD_REQUEST);
};

// Handle duplicate fields error from MongoDB
const handleDuplicateFieldsDB = (error: AppError) => {
  const value = error.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, StatusCodes.BAD_REQUEST);
};

// Handle validation error from MongoDB
const handleValidationErrorDB = (error: mongoose.Error.ValidationError) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Validation Error: Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, StatusCodes.BAD_REQUEST);
};

// Handle JWT error
const handleJWTError = () =>
  new AppError(
    'Invalid authentication credentials, please log in again!',
    StatusCodes.UNAUTHORIZED
  );

// Handle JWT expired error
const handleJWTExpiredError = () =>
  new AppError(
    'Your authentication credentials have expired, please log in again',
    StatusCodes.UNAUTHORIZED
  );

// Handle CSRF token error
const handleBadCSRFToken = () =>
  new AppError(
    'Missing CSRF token! Try reloading the application or logging in again later',
    StatusCodes.FORBIDDEN
  );

// Send error response in development mode
const sendErrorDev = (error: AppError, res: Response) => {
  const errorResponse = {
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  };

  logger.error(`ERROR 💥  ${error.message}. stack :${error.stack}  `);

  res.status(error.statusCode).json(errorResponse);
};

// Send error response in production mode
const sendErrorProd = (error: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  const status = error.isOperational ? error.status : 'error';
  const message = error.isOperational
    ? error.message
    : 'Something went wrong, please try again later';
  const statusCode = error.isOperational ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  logger.error(`ERROR 💥 ${error}`);

  res.status(statusCode).json({
    status,
    message,
  });
};

// Global error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status = err.status || 'error';
  error.message = err.message;
  error.stack = err.stack;
  // Determine environment
  const isDevError = ['development', 'local_dev', 'local', 'develop', 'staging'].includes(NODE_ENV);
  const isProdError = NODE_ENV === 'production';

  if (isDevError) {
    if (error.name === 'PayloadTooLargeError') error.message = 'The input data is too large';
    if (error.code === 11000) error.message = 'Duplicate document!';

    sendErrorDev(error, res);
  } else if (isProdError) {
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error instanceof mongoose.Error.ValidationError || error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'invalid csrf token') error = handleBadCSRFToken();

    sendErrorProd(error, res);
  }
};

export const uncaughtExceptionHandler = (err: Error) => {
  logger.fatal('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.fatal(err);
  process.exit(1);
};

export const unhandledRejectionHandler = (err: Error) => {
  logger.fatal('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.fatal(err, err.name, err.message);
  process.exit(1);
};
export default globalErrorHandler;
