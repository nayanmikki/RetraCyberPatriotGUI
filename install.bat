@echo off
echo ========================================
echo CyberPatriot Mint 21 Console Installer
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version: 
node --version
echo.

echo [INFO] npm version: 
npm --version
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] Installation complete!
    echo ========================================
    echo.
    echo To run the application, execute: npm run dev
    echo Then open http://localhost:3000 in your browser
    echo.
) else (
    echo.
    echo [ERROR] Installation failed!
    echo.
)

pause

