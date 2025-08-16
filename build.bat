@echo off
echo ========================================
echo    CRYPTO DASHBOARD - PRODUCTION BUILD
echo ========================================
echo.

echo [1/3] Running tests before build...
npm test -- --watchAll=false
if %errorlevel% neq 0 (
    echo.
    echo WARNING: Tests failed!
    set /p continue=Continue with build anyway? (y/N): 
    if /i not "%continue%"=="y" (
        echo Build cancelled.
        pause
        exit /b 1
    )
)
echo ✓ Tests completed

echo.
echo [2/3] Running TypeScript compiler...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ERROR: TypeScript compilation failed
    echo Please fix the errors above before building
    pause
    exit /b 1
)
echo ✓ TypeScript compilation successful

echo.
echo [3/3] Building production bundle...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo       BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Production files are in the 'dist' directory
echo.
echo To preview the production build:
echo   npm run preview
echo.
echo To deploy to a web server:
echo   Upload the contents of the 'dist' directory
echo.
pause