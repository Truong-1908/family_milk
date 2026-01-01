@echo off
title Milk Family Launcher
color 0b

echo ========================================================
echo        KHOI DONG HE THONG MILK FAMILY
echo ========================================================
echo.

echo 1. Dang khoi dong Backend Server...
start "Backend (Server)" cmd /k "cd backend && npm start"

echo 2. Dang khoi dong Frontend (Giao dien)...
start "Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   DA XONG! HE THONG DANG CHAY.
echo   - Backend: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo ========================================================
echo.
echo Hay doi 10-15 giay de server khoi dong hoan toat.
echo Ban co the thu nho cac cua so CMD (Dung tat chung).
echo.
pause
