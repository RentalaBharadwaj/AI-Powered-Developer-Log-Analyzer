# Test validation endpoints

Write-Host "`n=== Test 1: Empty content ===" -ForegroundColor Yellow
$response1 = Invoke-WebRequest -Uri "http://localhost:3000/api/analyze" -Method POST -Body '{"logContent":""}' -ContentType "application/json" -UseBasicParsing
Write-Host "Status:" $response1.StatusCode
Write-Host "Response:" $response1.Content

Write-Host "`n=== Test 2: Valid content ===" -ForegroundColor Yellow
$response2 = Invoke-WebRequest -Uri "http://localhost:3000/api/analyze" -Method POST -Body '{"logContent":"Error: Database connection failed"}' -ContentType "application/json" -UseBasicParsing
Write-Host "Status:" $response2.StatusCode
Write-Host "Response:" $response2.Content

Write-Host "`n=== Test 3: Health check ===" -ForegroundColor Yellow
$response3 = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -UseBasicParsing
Write-Host "Status:" $response3.StatusCode
Write-Host "Response:" $response3.Content

Write-Host "`n=== All tests completed ===" -ForegroundColor Green
