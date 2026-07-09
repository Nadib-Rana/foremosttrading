@echo off
echo Starting Frontend, Admin, and Backend servers...

start "Frontend" cmd /k "cd foremosttrading-frontend && bun run dev"
start "Admin" cmd /k "cd foremosttrading-admin && bun run dev"
start "Backend" cmd /k "cd foremosttrading-backend && bun run dev"
