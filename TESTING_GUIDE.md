# Testing the AI-Powered Developer Log Analyzer

## Quick Start

### 1. Start the Server

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000)

### 2. Open in Browser

Visit [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Test with Sample Log

Paste this sample error log into the text area:

```
[2024-03-15 14:23:10] ERROR: Database connection failed
[2024-03-15 14:23:10] ERROR: Error: connect ECONNREFUSED 127.0.0.1:5432
[2024-03-15 14:23:10] ERROR: at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
[2024-03-15 14:23:11] INFO: Attempting to reconnect to database...
[2024-03-15 14:23:16] ERROR: Database connection retry failed after 5 seconds
```

### 4. Click "Analyze Log"

The application will:
- Validate your input
- Send it to OpenAI GPT-4 for analysis
- Display results including:
  - Summary
  - Root Cause
  - Severity (High/Medium/Low)
  - 3 Suggested Fixes
  - Next Debugging Steps

## Other Test Logs

### JavaScript Runtime Error
```
[2024-01-15 10:32:45] ERROR: TypeError: Cannot read property 'map' of undefined
[2024-01-15 10:32:45] at renderList (/app/components/List.js:23:18)
[2024-01-15 10:32:45] at Component.render (/app/node_modules/react/Component.js:156:12)
[2024-01-15 10:32:45] ERROR: Component stack trace:
[2024-01-15 10:32:45]     in List (at Dashboard.js:45)
```

### Memory Leak
```
[2024-02-20 15:45:22] WARN: Memory usage: 1.2 GB / 2 GB (60%)
[2024-02-20 15:50:22] WARN: Memory usage: 1.5 GB / 2 GB (75%)
[2024-02-20 15:55:22] ERROR: Memory usage: 1.9 GB / 2 GB (95%)
[2024-02-20 15:56:15] FATAL: Out of memory error
[2024-02-20 15:56:15] ERROR: Process crashed with exit code 137
```

### Network Timeout
```
[2024-03-01 09:12:33] INFO: Fetching user data from API
[2024-03-01 09:12:34] INFO: Request sent to https://api.example.com/users
[2024-03-01 09:13:04] ERROR: Request timeout after 30 seconds
[2024-03-01 09:13:04] ERROR: Error: ETIMEDOUT
[2024-03-01 09:13:05] WARN: Retrying request (attempt 2/3)
```

## API Testing (Alternative)

### Using curl

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "logContent": "[2024-03-15 14:23:10] ERROR: Database connection failed\n[2024-03-15 14:23:10] ERROR: Error: connect ECONNREFUSED 127.0.0.1:5432"
  }'
```

### Using PowerShell

```powershell
$body = @{
    logContent = "[2024-03-15 14:23:10] ERROR: Database connection failed"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/analyze" -Method POST -Body $body -ContentType "application/json"
```

## Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1710512345678,
  "version": "1.0.0"
}
```

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use: `netstat -ano | findstr :3000`
- Verify Node.js is installed: `node --version` (should be 18+)
- Ensure dependencies are installed: `npm install`

### API Key Error
- Verify `.env` file exists and contains valid `OPENAI_API_KEY`
- API key should be on a single line without line breaks
- Format: `OPENAI_API_KEY=sk-proj-...`

### OpenAI API Rate Limits
- Free tier has rate limits
- Wait a few minutes if you hit the limit
- Response will show "Rate limit exceeded" error

### Empty or Invalid Results
- Check server console for error logs
- Verify API key is valid
- Ensure log content is plain text (not binary)
- Stay under 10,000 character limit

## Features Implemented

✅ **Phase 0**: Project setup  
✅ **Phase 1**: Express backend with API routes  
✅ **Phase 2**: Frontend UI with validation  
✅ **Phase 3**: Input validation and sanitization  
✅ **Phase 4**: OpenAI GPT-4 integration  
✅ **Phase 5**: Frontend connected to real API  

**Remaining**: Enhanced error handling, final testing

## Next Steps

To continue development:
1. Implement Phase 6: Enhanced error handling (timeouts, rate limiting)
2. Implement Phase 7: Final polish and comprehensive testing
3. Add more sophisticated prompt engineering for better results
4. Add support for different log formats
5. Add log history/caching
