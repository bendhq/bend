import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../packages/bend-core/src/scaffold/templates/stacks');

// Update JS database files to include projectName and rename to .ejs
const jsMongooseExpressDB = path.join(templatesDir, 'js/js-mongoose-express/src/config/database.js');

const updatedContent = `import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/<%= projectName %>';
    
    await mongoose.connect(mongoUri);
    
    logger.info(\`MongoDB Connected: \${mongoose.connection.host}\`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Mongoose connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
`;

if (fs.existsSync(jsMongooseExpressDB)) {
  fs.writeFileSync(jsMongooseExpressDB, updatedContent);
  fs.renameSync(jsMongooseExpressDB, jsMongooseExpressDB + '.ejs');
  console.log('✓ Updated and renamed js-mongoose-express/src/config/database.js');
}

// Check for js-mongoose-fastify
const jsMongooseFastifyDB = path.join(templatesDir, 'js/js-mongoose-fastify/src/config/database.js');
if (fs.existsSync(jsMongooseFastifyDB)) {
  fs.writeFileSync(jsMongooseFastifyDB, updatedContent);
  fs.renameSync(jsMongooseFastifyDB, jsMongooseFastifyDB + '.ejs');
  console.log('✓ Updated and renamed js-mongoose-fastify/src/config/database.js');
}

console.log('Done!');
