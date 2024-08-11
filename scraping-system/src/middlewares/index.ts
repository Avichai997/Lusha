import { pinoHttp } from 'pino-http';
import { logger } from '../utils/logger';

export const pinoHttpMiddleware = () => {
  pinoHttp({ logger: logger });
};
