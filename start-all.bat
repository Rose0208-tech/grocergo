@echo off
title GrocerGo Platform Launcher
echo ========================================================
echo   GrocerGo - Full-Stack Grocery Platform for India
echo ========================================================
echo.
echo Starting all 3 services in separate windows...
echo.

start "GrocerGo Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul

start "GrocerGo Customer Website (Port 5173)" cmd /k "cd /d %~dp0customer-frontend && npm run dev"
timeout /t 2 /nobreak >nul

start "GrocerGo Admin Dashboard (Port 5174)" cmd /k "cd /d %~dp0admin-frontend && npm run dev"

echo.
echo ========================================================
echo  All 3 services launched!
echo.
echo  - Customer Website:  http://localhost:5173
echo  - Admin Dashboard:   http://localhost:5174
echo  - Backend REST API:  http://localhost:5000/api
echo.
echo  Default Credentials:
echo   * Customer: customer@grocergo.com / Customer@123
echo   * Admin:    admin@grocergo.com / Admin@123
echo ========================================================
pause
