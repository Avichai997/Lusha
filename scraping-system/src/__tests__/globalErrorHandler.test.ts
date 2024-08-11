import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import globalErrorHandler from '../utils/errorHandler';
import AppError from '../utils/AppError';

const app = express();

app.get('/test/cast-error', (_req: Request, _res: Response, next: NextFunction) => {
  const castError = new mongoose.Error.CastError('ObjectId', 'invalid_id', '_id');
  next(castError);
});

app.get('/test/validation-error', (_req: Request, _res: Response, next: NextFunction) => {
  const validationError = new mongoose.Error.ValidationError();
  validationError.addError(
    'field',
    new mongoose.Error.ValidatorError({ message: 'Invalid field' })
  );
  next(validationError);
});

app.get('/test/duplicate-error', (_req: Request, _res: Response, next: NextFunction) => {
  const duplicateError = new AppError(
    'E11000 duplicate key error collection',
    StatusCodes.BAD_REQUEST
  );
  // @ts-ignore
  duplicateError.code = 11000;
  next(duplicateError);
});

app.get('/test/jwt-error', (_req: Request, _res: Response, next: NextFunction) => {
  const jwtError = new AppError('Invalid authentication credentials', StatusCodes.UNAUTHORIZED);
  jwtError.name = 'JsonWebTokenError';
  next(jwtError);
});

app.get('/test/generic-error', (_req: Request, _res: Response, next: NextFunction) => {
  const genericError = new Error('Something went wrong!');
  next(genericError);
});

app.use(globalErrorHandler);

describe('Global Error Handler', () => {
  it('should handle CastError correctly', async () => {
    const res = await request(app).get('/test/cast-error');

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Invalid value _id: invalid_id.');
  });

  it('should handle ValidationError correctly', async () => {
    const res = await request(app).get('/test/validation-error');

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty(
      'message',
      'Validation Error: Invalid input data. Invalid field'
    );
  });

  it('should handle duplicate key error correctly', async () => {
    const res = await request(app).get('/test/duplicate-error');

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty(
      'message',
      'Duplicate field value: undefined. Please use another value!'
    );
  });

  it('should handle JWT error correctly', async () => {
    const res = await request(app).get('/test/jwt-error');

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty(
      'message',
      'Invalid authentication credentials, please log in again!'
    );
  });

  it('should handle generic errors correctly', async () => {
    const res = await request(app).get('/test/generic-error');

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message', 'Something went wrong, please try again later');
  });
});
