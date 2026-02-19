# Simple OpenAI Integration Test

$url = "http://localhost:3000/api/analyze"

$testLog = @"
[2024-03-15 14:23:10] ERROR: Database connection failed
[2024-03-15 14:23:10] ERROR: Error: connect ECONNREFUSED 127.0.0.1:5432
[2024-03-15 14:23:10] ERROR: at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
[2024-03-15 14:23:11] INFO: Attempting to reconnect to database...
[2024-03-15 14:23:16] ERROR: Database connection retry failed after 5 seconds
"@

$body = @{
    logContent = $testLog
} | ConvertTo-Json

Write-Host "Testing OpenAI Integration..." -ForegroundColor Cyan
Write-Host "Sending request to $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Summary: $($response.data.summary)" -ForegroundColor White
    Write-Host ""
    Write-Host "Root Cause: $($response.data.rootCause)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Severity: $($response.data.severity)" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Suggested Fixes:" -ForegroundColor Cyan
    $response.data.suggestedFixes | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    $response.data.nextSteps | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
