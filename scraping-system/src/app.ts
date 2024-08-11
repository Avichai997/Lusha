import express from 'express';
import healthRouter from './components/health/health.router';
import AppError from './utils/AppError';
import globalErrorHandler from './utils/errorHandler';
import { StatusCodes } from 'http-status-codes';
import urlRouter from './components/Url/Url.router';
import { logger } from './utils/logger';
import { pinoHttp } from 'pino-http';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/health', healthRouter);

app.use('/api/parse', urlRouter);

app.all('*', (req, _res, next) =>
  next(
    new AppError(`The URL ${req.originalUrl} does not exist on the server!`, StatusCodes.NOT_FOUND)
  )
);

// Catch errors:
app.use(globalErrorHandler);

export default app;
