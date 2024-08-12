import { PORT } from './utils/environment';
import app from './app';
import connectDB from './utils/connectDB';
import { logger } from './utils/logger';
import { uncaughtExceptionHandler, unhandledRejectionHandler } from './utils/errorHandler';

process.on('uncaughtException', uncaughtExceptionHandler);

const bootstrap = async () => {
  logger.trace('bootstrapping services');
  await connectDB();
};

bootstrap()
  .then(async () => {
    app.listen(PORT, () => {
      logger.info(`Server is up and running at: ${PORT}`);
    });

    process.on('unhandledRejection', unhandledRejectionHandler);
  })
  .catch(async (err) => {
    logger.error(`failed to init services: ${err}`);
  });
