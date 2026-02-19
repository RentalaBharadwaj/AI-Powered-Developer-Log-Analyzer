const logger = require('./logger');

/**
 * Handle API errors and map to user-friendly messages
 * @param {Error} error - The error object
 * @returns {Object} - { statusCode, message, code }
 */
function handleApiError(error) {
  logger.logError(error);

  // Default error response
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let code = 'INTERNAL_ERROR';

  // Axios/Network errors
  if (error.response) {
    // HTTP error response from external API
    statusCode = error.response.status;
    
    switch (statusCode) {
      case 401:
        message = 'Invalid API key configuration';
        code = 'AUTH_ERROR';
        break;
      case 429:
        message = 'Rate limit exceeded. Please try again later.';
        code = 'RATE_LIMIT';
        statusCode = 429;
        break;
      case 500:
      case 502:
      case 503:
        message = 'OpenAI API is currently unavailable. Please try again later.';
        code = 'EXTERNAL_SERVICE_ERROR';
        statusCode = 503;
        break;
      default:
        message = 'Failed to analyze log';
        code = 'API_ERROR';
    }
  } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    // Timeout error
    message = 'Request timed out. Please try again with a smaller log.';
    code = 'TIMEOUT_ERROR';
    statusCode = 504;
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    // Network error
    message = 'Cannot connect to OpenAI API. Check network connection.';
    code = 'NETWORK_ERROR';
    statusCode = 503;
  } else if (error.message) {
    // Custom error message
    message = error.message;
    
    // Map known error messages to codes
    if (message.includes('validation')) {
      code = 'VALIDATION_ERROR';
      statusCode = 400;
    } else if (message.includes('parsing') || message.includes('parse')) {
      code = 'PARSING_ERROR';
      statusCode = 500;
    }
  }

  return {
    statusCode,
    message,
    code
  };
}

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 * @returns {Object} - Error response object
 */
function createErrorResponse(message, statusCode = 500, code = 'ERROR') {
  return {
    success: false,
    error: message,
    code,
    timestamp: Date.now()
  };
}

module.exports = {
  handleApiError,
  createErrorResponse
};
