@echo off
echo ========================================
echo    CRYPTO DASHBOARD - TEST RUNNER
echo ========================================
echo.

:MENU
echo Select test mode:
echo   1. Run all tests once
echo   2. Run tests in watch mode (recommended for development)
echo   3. Run tests with coverage report
echo   4. Run specific test file
echo   5. Exit
echo.
set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto RUN_ONCE
if "%choice%"=="2" goto RUN_WATCH
if "%choice%"=="3" goto RUN_COVERAGE
if "%choice%"=="4" goto RUN_SPECIFIC
if "%choice%"=="5" goto EXIT
goto INVALID

:RUN_ONCE
echo.
echo Running all tests once...
npm test -- --watchAll=false
goto END

:RUN_WATCH
echo.
echo Running tests in watch mode...
echo (Tests will re-run automatically when files change)
npm run test:watch
goto END

:RUN_COVERAGE
echo.
echo Running tests with coverage report...
npm run test:coverage
echo.
echo Coverage report generated in coverage/ directory
goto END

:RUN_SPECIFIC
echo.
set /p testfile=Enter test file name (e.g., PriceChart): 
echo Running tests for %testfile%...
npm test -- %testfile% --watchAll=false
goto END

:INVALID
echo.
echo Invalid choice. Please select 1-5.
echo.
goto MENU

:END
echo.
echo Tests completed!
pause
goto MENU

:EXIT
echo.
echo Exiting test runner...
exit /b 0