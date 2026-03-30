# 1. KILL STUCK PROCESSES
Write-Host "🧹 Clearing zombie processes..." -ForegroundColor Cyan
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# 2. STARTUP (Visible for Debugging)
Write-Host "🚀 Launching Proxy..." -ForegroundColor Cyan
# We use -NoNewWindow so you can see the proxy's own logs in THIS terminal
Start-Job -ScriptBlock { antigravity-claude-proxy start }

# 3. VERIFICATION
Write-Host "⏳ Waiting for Gemini Bridge..." -ForegroundColor Gray
$connected = $false
for ($i = 0; $i -lt 15; $i++) {
    try {
        $test = Invoke-WebRequest -Uri "http://127.0.0.1:8080/health" -UseBasicParsing -ErrorAction Stop
        $connected = $true
        break
    }
    catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
        Start-Sleep -s 1
    }
}

if (-not $connected) {
    Write-Host "`n❌ PROXY FAILED. Run 'antigravity-claude-proxy start' manually to see the error." -ForegroundColor Red
    return
}

# 4. ENV & LAUNCH
$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:8080"
$env:ANTHROPIC_API_KEY = "dummy-key-for-bridge"
Write-Host "`n✅ CONNECTED! Launching Claude CLI..." -ForegroundColor Green
claude