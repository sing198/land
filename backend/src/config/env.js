const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'alro_land',
    CONNECTION_LIMIT: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'default_jwt_secret_please_change_in_production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
  UPLOAD: {
    PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  }
};

module.exports = env;
