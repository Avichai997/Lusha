import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError';
import { NODE_ENV } from './environment';
import { logger } from './logger';

const handleCastErrorDB = (error: mongoose.Error.CastError) => {
  const message = `Invalid value ${error.path}: ${error.value}.`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (error: mongoose.Error.ValidationError) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Validation Error: Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (error: any) => {
  const value = error.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleJWTError = () =>
  new AppError(
    'Invalid authentication credentials, please log in again!',
    StatusCodes.UNAUTHORIZED
  );

const handleJWTExpiredError = () =>
  new AppError(
    'Your authentication credentials have expired, please log in again',
    StatusCodes.UNAUTHORIZED
  );

// Global error handling middleware
const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (NODE_ENV === 'development') {
    return res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.message,
      stack: error.stack,
    });
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.isOperational ? error.message : 'Something went wrong!',
  });
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
