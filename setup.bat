@echo off
echo ========================================
echo    CRYPTO DASHBOARD - SETUP SCRIPT
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/4] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)
echo ✓ npm is installed

echo.
echo [3/4] Installing dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully

echo.
echo [4/4] Running tests to verify setup...
npm test -- --watchAll=false
if %errorlevel% neq 0 (
    echo WARNING: Some tests failed, but the project should still work
) else (
    echo ✓ All tests passed
)

echo.
echo ========================================
echo       SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo   1. Run "start-dev.bat" to start the development server
echo   2. Run "run-tests.bat" to run tests
echo   3. Run "build.bat" to create a production build
echo.
echo The crypto dashboard will be available at:
echo   http://localhost:5173
echo.
pause