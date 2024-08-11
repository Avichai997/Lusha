import express, { Request, Response } from 'express';
import healthRouter from './components/health/health.router';
import AppError from './utils/AppError';
import globalErrorHandler from './utils/errorHandler';
import { StatusCodes } from 'http-status-codes';
import urlRouter from './components/Url/Url.router';

const app = express();
app.use(express.json());

app.use('/health', healthRouter);

app.post('/parse', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const result = parse(url);
  res.json(result);
});

app.use('/api/parse', urlRouter);

app.all('*', (req, _res, next) =>
  next(
    new AppError(`The URL ${req.originalUrl} does not exist on the server!`, StatusCodes.NOT_FOUND)
  )
);

// Catch errors:
app.use(globalErrorHandler);

export default app;
