import mongoose from 'mongoose';

export const checkHealth = async (req, reply) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  reply.send({
    success: true,
    message: 'Server is healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};