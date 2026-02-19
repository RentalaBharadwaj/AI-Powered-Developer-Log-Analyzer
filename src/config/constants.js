require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
  MAX_LOG_LENGTH: parseInt(process.env.MAX_LOG_LENGTH) || 10000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
