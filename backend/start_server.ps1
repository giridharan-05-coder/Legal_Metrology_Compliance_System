# Legal Metrology Backend Startup Script
# Sets EasyOCR model path to D: drive to avoid C: drive space issues

$env:EASYOCR_MODULE_PATH = "D:\lmc_home\.EasyOCR"
$env:HOME = "D:\lmc_home"

Write-Host "Starting Legal Metrology Compliance API..." -ForegroundColor Cyan
Write-Host "EasyOCR model path: D:\lmc_home\.EasyOCR\model" -ForegroundColor Green
uvicorn main:app --reload --host 0.0.0.0 --port 8000
