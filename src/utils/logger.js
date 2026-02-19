function logError(error, context = {}) {
  const timestamp = new Date().toISOString();
  console.error('═══════════════════════════════════════');
  console.error(`[ERROR] ${timestamp}`);
  console.error('Message:', error.message);
  console.error('Context:', context);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  console.error('═══════════════════════════════════════');
}

function logInfo(message, data = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] ${timestamp} - ${message}`, data);
}

function logWarn(message, data = {}) {
  const timestamp = new Date().toISOString();
  console.warn(`[WARN] ${timestamp} - ${message}`, data);
}

module.exports = {
  logError,
  logInfo,
  logWarn
};
