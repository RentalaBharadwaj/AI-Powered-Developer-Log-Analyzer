const constants = require('../config/constants');

/**
 * Validate log input
 * @param {string} logContent - The log content to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
function validateLogInput(logContent) {
  // Check if content exists
  if (!logContent) {
    return {
      valid: false,
      error: 'Log content is required'
    };
  }

  // Check if it's a string
  if (typeof logContent !== 'string') {
    return {
      valid: false,
      error: 'Log content must be a string'
    };
  }

  // Check length
  const trimmedContent = logContent.trim();
  
  if (trimmedContent.length === 0) {
    return {
      valid: false,
      error: 'Log content cannot be empty'
    };
  }

  if (trimmedContent.length > constants.MAX_LOG_LENGTH) {
    return {
      valid: false,
      error: `Log content exceeds maximum length of ${constants.MAX_LOG_LENGTH} characters`
    };
  }

  return { valid: true };
}

/**
 * Sanitize input to remove potentially harmful content
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Normalize line endings to \n
  sanitized = sanitized.replace(/\r\n/g, '\n');
  sanitized = sanitized.replace(/\r/g, '\n');

  // Trim excessive whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

module.exports = {
  validateLogInput,
  sanitizeInput
};
