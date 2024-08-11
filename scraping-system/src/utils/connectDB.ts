import mongoose from 'mongoose';
import { MONGO_CONN } from '../utils/environment';
import { logger } from './logger';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONN);
    logger.info('Database connected successfully');
  } catch (e) {
    if (e instanceof Error) {
      logger.fatal(`Database connection refused ${e.message}${e.stack}`);
      process.exit(1);
    }
  }
};

export default connectDB;
