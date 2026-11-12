@echo off
setlocal enabledelayedexpansion
title GrocerGo Customer Portal (iPad Server)
echo ========================================================
echo   GrocerGo - Customer Portal (Customer Only)
echo ========================================================
echo.
echo [1/2] Starting GrocerGo Backend API on port 5000...
start "GrocerGo Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"
ping -n 3 127.0.0.1 >nul

echo [2/2] Starting GrocerGo Customer Website on port 5173...
start "GrocerGo Customer Website (Port 5173)" cmd /k "cd /d %~dp0customer-frontend && npm run dev"

set "MY_IP=192.168.1.11"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo %%b | findstr /v "192.168.56." >nul && set "MY_IP=%%b"
    )
)

echo.
echo ========================================================
echo  Customer Portal and Backend Server Deployed!
echo.
echo  Admin portal has NOT been started (as requested).
echo.
echo  ACCESS ON THIS COMPUTER:
echo    http://localhost:5173
echo.
echo  ACCESS ON YOUR IPAD / MOBILE (Safari / Chrome):
echo    http://!MY_IP!:5173
echo.
echo  (Make sure your iPad is connected to the same Wi-Fi)
echo ========================================================
