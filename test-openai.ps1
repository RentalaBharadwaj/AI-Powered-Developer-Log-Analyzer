# Test OpenAI Integration

Write-Host ""
Write-Host "=== Testing OpenAI Integration ===" -ForegroundColor Cyan

$testLog = @"
Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
    at Protocol._enqueue (/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Connection.connect (/node_modules/mysql/lib/Connection.js:119:18)
    at Server.start (/app/server.js:45:12)

PostgreSQL connection failed: database "myapp" does not exist
"@

$body = @{
    logContent = $testLog
} | ConvertTo-Json
"
Write-Host "
Write-Host "`nSending log to API..." -ForegroundColor Yellow
Write-Host "Log content: " -NoNewline
Write-Host $testLog.Substring(0, [Math]::Min(100, $testLog.Length)) -ForegroundColor Gray
Write-Host "...`n"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/analyze" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ""oregroundColor Green
    Write-Host "`nResponse:`n" -ForegroundColor Green
    
    $jsonResponse = $response.Content | ConvertFrom-Json
    
    if ($jsonResponse.success) {
        Write-Host "Success: Analysis successful!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host $"
        Write-Host "onResponse.data.summary -ForegroundColor White
        
        Write-Host ""
        Write-Host "Root Cause:" -ForegroundColor Cyan
        Write-Host $jsonResponse.data.rootCause -ForegroundColor White
        "
        Write-Host "
        Write-Host "`nSeverity:" -ForegroundColor Cyan
        Write-Host $"
        Write-Host "onResponse.data.severity -ForegroundColor White
        
        Write-Host "`nSuggested Fixes:" -ForegroundColor Cyan
        $jsonResponse.data.suggestedFixes | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
        
        Write-Host "`nNext Steps:" -ForegroundColor Cyan
        $jsonRes"
    Write-Host "e.data.nextSteps | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    } else {
        Write-Host "✗ Analysis failed:" $jsonResponse.error -ForegroundColor Red
    }
    
} catch {
    Write-Host "`n✗ Error:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Red
    }
}
"
Write-Host "
Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
