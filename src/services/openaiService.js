const axios = require('axios');
const constants = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Analyze log content using OpenAI API
 * @param {string} logContent - Sanitized log content
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeLogWithAI(logContent) {
  // Verify API key exists
  if (!constants.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    logger.logInfo('Calling OpenAI API', {
      model: 'gpt-4',
      logLength: logContent.length
    });

    const messages = buildPrompt(logContent);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${constants.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: constants.API_TIMEOUT
      }
    );

    logger.logInfo('OpenAI API response received', {
      choices: response.data.choices?.length
    });

    return parseResponse(response.data);

  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      const status = error.response.status;
      const apiError = error.response.data?.error;
      
      logger.logError(error, {
        status,
        apiError: apiError?.message
      });

      if (status === 401) {
        throw new Error('Invalid API key configuration');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status >= 500) {
        throw new Error('OpenAI API is currently unavailable. Please try again later.');
      } else {
        throw new Error(`OpenAI API error: ${apiError?.message || 'Unknown error'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try with a smaller log.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to OpenAI API. Check network connection.');
    } else {
      throw new Error('Unexpected error during analysis');
    }
  }
}

/**
 * Build the prompt messages for OpenAI
 * @param {string} logContent - The log content
 * @returns {Array} - Array of message objects
 */
function buildPrompt(logContent) {
  const systemMessage = {
    role: 'system',
    content: `You are an expert developer debugging assistant. Analyze the provided logs and respond in JSON format with the following structure:

{
  "summary": "A concise 2-3 sentence summary of the main issue",
  "rootCause": "Detailed explanation of the underlying root cause",
  "severity": "High" | "Medium" | "Low",
  "suggestedFixes": ["Fix 1", "Fix 2", "Fix 3"],
  "nextSteps": ["Step 1", "Step 2", "Step 3", ...]
}

Guidelines:
- summary: Brief overview of what went wrong
- rootCause: Technical explanation of why it happened
- severity: High (crashes, data loss, security), Medium (functional errors, warnings), Low (minor issues, deprecations)
- suggestedFixes: Exactly 3 specific, actionable fixes ordered by likelihood of success
- nextSteps: 3-5 debugging steps for further investigation

Respond ONLY with valid JSON, no additional text.`
  };

  const userMessage = {
    role: 'user',
    content: `Analyze this log:\n\n${logContent}`
  };

  return [systemMessage, userMessage];
}

/**
 * Parse and validate OpenAI API response
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} - Parsed analysis data
 */
function parseResponse(apiResponse) {
  try {
    if (!apiResponse.choices || apiResponse.choices.length === 0) {
      throw new Error('No response choices returned from API');
    }

    const content = apiResponse.choices[0].message.content;
    
    // Try to extract JSON even if wrapped in markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.summary || typeof parsed.summary !== 'string') {
      throw new Error('Missing or invalid summary field');
    }

    if (!parsed.rootCause || typeof parsed.rootCause !== 'string') {
      throw new Error('Missing or invalid rootCause field');
    }

    if (!parsed.severity || !['High', 'Medium', 'Low'].includes(parsed.severity)) {
      throw new Error('Missing or invalid severity field');
    }

    // Validate and fix suggestedFixes
    if (!Array.isArray(parsed.suggestedFixes)) {
      throw new Error('suggestedFixes must be an array');
    }

    // Ensure exactly 3 fixes
    if (parsed.suggestedFixes.length > 3) {
      parsed.suggestedFixes = parsed.suggestedFixes.slice(0, 3);
    } else if (parsed.suggestedFixes.length < 3) {
      while (parsed.suggestedFixes.length < 3) {
        parsed.suggestedFixes.push('No additional fix available at this time');
      }
    }

    // Validate nextSteps
    if (!Array.isArray(parsed.nextSteps) || parsed.nextSteps.length === 0) {
      throw new Error('nextSteps must be a non-empty array');
    }

    logger.logInfo('Response parsed successfully', {
      severity: parsed.severity,
      fixesCount: parsed.suggestedFixes.length,
      stepsCount: parsed.nextSteps.length
    });

    return parsed;

  } catch (error) {
    logger.logError(error, {
      context: 'Response parsing',
      response: apiResponse
    });
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

module.exports = {
  analyzeLogWithAI
};
