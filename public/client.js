// DOM Elements
const logInput = document.getElementById('logInput');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const errorDisplay = document.getElementById('errorDisplay');
const errorMessage = document.getElementById('errorMessage');
const closeError = document.getElementById('closeError');
const resetBtn = document.getElementById('resetBtn');

// Constants
const MAX_LENGTH = 10000;

// Character counter
logInput.addEventListener('input', updateCharCounter);

function updateCharCounter() {
  const length = logInput.value.length;
  charCount.textContent = `${length.toLocaleString()} / ${MAX_LENGTH.toLocaleString()}`;
  
  if (length > MAX_LENGTH) {
    charCount.classList.add('over-limit');
    analyzeBtn.disabled = true;
  } else {
    charCount.classList.remove('over-limit');
    analyzeBtn.disabled = length === 0;
  }
}

// Form submission
analyzeBtn.addEventListener('click', handleSubmit);

async function handleSubmit() {
  const logContent = logInput.value.trim();
  
  // Validation
  if (!logContent) {
    showError('Please enter log content');
    return;
  }
  
  if (logContent.length > MAX_LENGTH) {
    showError(`Log content exceeds maximum length of ${MAX_LENGTH.toLocaleString()} characters`);
    return;
  }
  
  // Hide previous results/errors
  hideError();
  resultsSection.classList.add('hidden');
  
  // Show loading
  loadingIndicator.classList.remove('hidden');
  analyzeBtn.disabled = true;
  
  try {
    // Call the real API
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ logContent })
    });
    
    const result = await response.json();
    
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(result.error || `Server error: ${response.status}`);
    }
    
    // Check for API success flag
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }
    
    // Validate that we have data
    if (!result.data) {
      throw new Error('No analysis data received from server');
    }
    
    // Display the results
    displayResults(result.data);
    
  } catch (error) {
    showError(error.message || 'An error occurred during analysis');
  } finally {
    loadingIndicator.classList.add('hidden');
    analyzeBtn.disabled = false;
  }
}

// Display results
function displayResults(data) {
  // Validate data exists
  if (!data) {
    showError('Invalid response data');
    return;
  }
  
  document.getElementById('resultSummary').textContent = data.summary || 'No summary available';
  document.getElementById('resultRootCause').textContent = data.rootCause || 'No root cause identified';
  
  // Severity badge
  const severityBadge = document.getElementById('resultSeverity');
  severityBadge.textContent = data.severity || 'Unknown';
  severityBadge.className = `severity-badge severity-${(data.severity || 'medium').toLowerCase()}`;
  
  // Fixes
  const fixesList = document.getElementById('resultFixes');
  fixesList.innerHTML = '';
  if (data.suggestedFixes && Array.isArray(data.suggestedFixes)) {
    data.suggestedFixes.forEach(fix => {
      const li = document.createElement('li');
      li.textContent = fix;
      fixesList.appendChild(li);
    });
  }
  
  // Next steps
  const stepsList = document.getElementById('resultNextSteps');
  stepsList.innerHTML = '';
  if (data.nextSteps && Array.isArray(data.nextSteps)) {
    data.nextSteps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      stepsList.appendChild(li);
    });
  }
  
  // Show results
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Error handling
function showError(message) {
  errorMessage.textContent = message;
  errorDisplay.classList.remove('hidden');
  errorDisplay.scrollIntoView({ behavior: 'smooth' });
}

function hideError() {
  errorDisplay.classList.add('hidden');
}

closeError.addEventListener('click', hideError);

// Reset form
resetBtn.addEventListener('click', resetForm);

function resetForm() {
  logInput.value = '';
  updateCharCounter();
  resultsSection.classList.add('hidden');
  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
updateCharCounter();
