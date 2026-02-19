const express = require('express');
const router = express.Router();
const validationService = require('../services/validationService');
const openaiService = require('../services/openaiService');
const logger = require('../utils/logger');

// Analyze endpoint
router.post('/analyze', async (req, res, next) => {
  try {
    const { logContent } = req.body;
    
    logger.logInfo('Received analysis request', {
      contentLength: logContent ? logContent.length : 0
    });

    // Validate input
    const validation = validationService.validateLogInput(logContent);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: 'VALIDATION_ERROR'
      });
    }

    // Sanitize input
    const sanitizedLog = validationService.sanitizeInput(logContent);
    
    logger.logInfo('Validation passed, calling OpenAI service');

    // Call OpenAI service
    const analysis = await openaiService.analyzeLogWithAI(sanitizedLog);
    
    logger.logInfo('Analysis completed successfully');

    // Return results
    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    logger.logError(error, { context: 'API route /analyze' });
    next(error);
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    version: '1.0.0'
  });
});

module.exports = router;
