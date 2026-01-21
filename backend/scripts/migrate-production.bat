@echo off
REM Script para ejecutar migraciones en PRODUCCION de forma segura (Windows)
REM Uso: scripts\migrate-production.bat

echo ================================================
echo   MIGRACIONES DE BASE DE DATOS - PRODUCCION
echo ================================================
echo.

REM Verificar que existe package.json
if not exist "package.json" (
    echo ERROR: Debes ejecutar este script desde el directorio backend/
    exit /b 1
)

REM Verificar que existe .env
if not exist ".env" (
    echo ERROR: No existe archivo .env
    echo        Crea un archivo .env con las variables de produccion
    exit /b 1
)

echo ADVERTENCIA: Estas a punto de ejecutar migraciones en PRODUCCION
echo.
echo Antes de continuar, asegurate de:
echo   1. Tener un BACKUP reciente de la base de datos
echo   2. Haber probado las migraciones en desarrollo
echo   3. Tener acceso para revertir cambios si es necesario
echo.
set /p confirmacion="Deseas continuar? (escribe SI para confirmar): "

if not "%confirmacion%"=="SI" (
    echo Operacion cancelada
    exit /b 0
)

echo.
echo Estado actual de migraciones:
echo ================================================
set NODE_ENV=production
call npx sequelize-cli db:migrate:status

echo.
echo Ejecutando migraciones pendientes...
echo ================================================

REM Ejecutar migraciones
set NODE_ENV=production
call npm run migrate

echo.
echo Migraciones completadas!
echo.
echo Estado final de migraciones:
echo ================================================
set NODE_ENV=production
call npx sequelize-cli db:migrate:status

echo.
echo Proceso completado exitosamente
echo.
echo Recuerda:
echo   - Verificar que la aplicacion funcione correctamente
echo   - Revisar los logs por posibles errores
echo   - Mantener el backup por si necesitas revertir
echo.
pause
