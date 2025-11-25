import mongoose from 'mongoose';

export const getHealthStatus = async (req, res)=> {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
    },
    memory: {
      usage: process.memoryUsage(),
      free: require('os').freemem(),
      total: require('os').totalmem(),
    },
  };

  const httpCode = healthCheck.database.connected ? 200 : 503;

  res.status(httpCode).json({
    success: healthCheck.database.connected,
    data: healthCheck,
  });
};
