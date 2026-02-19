const express = require('express');
const path = require('path');
const constants = require('./config/constants');
const apiRoutes = require('./routes/api');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.logInfo(`${req.method} ${req.path}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const errorResponse = errorHandler.handleApiError(err);
  
  res.status(errorResponse.statusCode).json(
    errorHandler.createErrorResponse(
      errorResponse.message,
      errorResponse.statusCode,
      errorResponse.code
    )
  );
});

// Start server
const PORT = constants.PORT;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${constants.NODE_ENV}`);
  console.log(`✓ API Key configured: ${constants.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
