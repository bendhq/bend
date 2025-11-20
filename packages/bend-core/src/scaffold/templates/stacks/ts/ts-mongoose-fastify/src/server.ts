import app from './app';
import logger from './config/logger';
import connectDB from './config/database';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    logger.info(`Server running on port ${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();