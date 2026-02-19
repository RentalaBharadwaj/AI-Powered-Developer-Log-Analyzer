#!/bin/bash

# Test OpenAI Integration with curl

URL="http://localhost:3000/api/analyze"

# Test log data
LOG_DATA='[2024-03-15 14:23:10] ERROR: Database connection failed
[2024-03-15 14:23:10] ERROR: Error: connect ECONNREFUSED 127.0.0.1:5432
[2024-03-15 14:23:10] ERROR: at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
[2024-03-15 14:23:11] INFO: Attempting to reconnect to database...
[2024-03-15 14:23:16] ERROR: Database connection retry failed after 5 seconds'

echo "Testing OpenAI Integration..."
echo "Sending request to $URL"
echo ""

# Make the API call
RESPONSE=$(curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"logContent\": $(echo "$LOG_DATA" | jq -Rs .)}")

echo "$RESPONSE" | jq .

# Extract and display specific fields
if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  echo ""
  echo "=== Analysis Results ==="
  echo ""
  echo "Summary:"
  echo "$RESPONSE" | jq -r '.data.summary'
  echo ""
  echo "Root Cause:"
  echo "$RESPONSE" | jq -r '.data.rootCause'
  echo ""
  echo "Severity:"
  echo "$RESPONSE" | jq -r '.data.severity'
  echo ""
  echo "Suggested Fixes:"
  echo "$RESPONSE" | jq -r '.data.suggestedFixes[]' | sed 's/^/  - /'
  echo ""
  echo "Next Steps:"
  echo "$RESPONSE" | jq -r '.data.nextSteps[]' | sed 's/^/  - /'
else
  echo "Error in response"
fi
