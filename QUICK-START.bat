@echo off
echo ========================================
echo    CRYPTO DASHBOARD - QUICK START
echo ========================================
echo.
echo This script will get your crypto dashboard running in seconds!
echo.

echo [Step 1] Checking if setup is needed...
if not exist "node_modules\" (
    echo Setup required! Running setup script...
    call setup.bat
    if %errorlevel% neq 0 (
        echo Setup failed. Please check the error messages above.
        pause
        exit /b 1
    )
) else (
    echo ✓ Project already set up
)

echo.
echo [Step 2] Starting the crypto dashboard...
echo.
echo ========================================
echo    🚀 LAUNCHING CRYPTO DASHBOARD
echo ========================================
echo.
echo Your crypto dashboard is starting up!
echo.
echo Features you'll see:
echo   📈 Live cryptocurrency prices
echo   📊 Interactive charts with 7-day history
echo   🤖 AI-powered trend predictions
echo   💹 Real-time market data
echo   📱 Responsive design for any device
echo.
echo The dashboard will automatically open in your browser.
echo If not, manually navigate to: http://localhost:5173
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

start "" "http://localhost:5173"
npm run dev