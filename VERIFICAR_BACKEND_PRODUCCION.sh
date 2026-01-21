#!/bin/bash

# Script para verificar el estado del backend en producción
# Ejecutar en el servidor: bash VERIFICAR_BACKEND_PRODUCCION.sh

echo "=========================================="
echo "🔍 VERIFICACIÓN BACKEND - TecnoAndamio"
echo "=========================================="
echo ""

# 1. Verificar que el backend está corriendo
echo "1️⃣ PROCESO BACKEND:"
BACKEND_PID=$(pgrep -f "node.*backend" | head -1)
if [ -z "$BACKEND_PID" ]; then
    echo "   ❌ Backend NO está corriendo"
    echo "   Necesitas iniciar el backend"
else
    echo "   ✅ Backend corriendo (PID: $BACKEND_PID)"
    echo "   Comando: $(ps -p $BACKEND_PID -o args= | head -c 100)"
fi
echo ""

# 2. Verificar archivo .env
echo "2️⃣ ARCHIVO .ENV:"
if [ -f "./backend/.env" ]; then
    echo "   ✅ Archivo existe"
    echo "   Ubicación: $(pwd)/backend/.env"
    echo "   Tamaño: $(stat -f%z ./backend/.env 2>/dev/null || stat -c%s ./backend/.env) bytes"
    echo "   Permisos: $(ls -la ./backend/.env | awk '{print $1}')"
else
    echo "   ❌ Archivo .env NO existe"
    echo "   Ruta esperada: $(pwd)/backend/.env"
fi
echo ""

# 3. Verificar variables de entorno
echo "3️⃣ VARIABLES DE ENTORNO:"
cd backend
NODE_ENV_VALUE=$(node -e "require('dotenv').config(); console.log(process.env.NODE_ENV || 'undefined')")
JWT_SECRET_VALUE=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET ? 'DEFINIDO ('+process.env.JWT_SECRET.length+' chars)' : 'undefined')")
DB_NAME_VALUE=$(node -e "require('dotenv').config(); console.log(process.env.DB_NAME || 'undefined')")
FRONTEND_URL_VALUE=$(node -e "require('dotenv').config(); console.log(process.env.FRONTEND_URL || 'undefined')")
CORS_ORIGIN_VALUE=$(node -e "require('dotenv').config(); console.log(process.env.CORS_ORIGIN || 'undefined')")

echo "   NODE_ENV: $NODE_ENV_VALUE"
echo "   JWT_SECRET: $JWT_SECRET_VALUE"
echo "   DB_NAME: $DB_NAME_VALUE"
echo "   FRONTEND_URL: $FRONTEND_URL_VALUE"
echo "   CORS_ORIGIN: $CORS_ORIGIN_VALUE"
cd ..
echo ""

# 4. Verificar duplicados en .env
echo "4️⃣ VERIFICAR DUPLICADOS EN .ENV:"
if [ -f "./backend/.env" ]; then
    FRONTEND_URL_COUNT=$(grep -c "^FRONTEND_URL=" ./backend/.env)
    CORS_ORIGIN_COUNT=$(grep -c "^CORS_ORIGIN=" ./backend/.env)

    if [ "$FRONTEND_URL_COUNT" -gt 1 ]; then
        echo "   ⚠️ FRONTEND_URL definido $FRONTEND_URL_COUNT veces (debe ser 1)"
        echo "   Valores encontrados:"
        grep "^FRONTEND_URL=" ./backend/.env | nl
    else
        echo "   ✅ FRONTEND_URL definido 1 vez"
    fi

    if [ "$CORS_ORIGIN_COUNT" -gt 1 ]; then
        echo "   ⚠️ CORS_ORIGIN definido $CORS_ORIGIN_COUNT veces (debe ser 1)"
        echo "   Valores encontrados:"
        grep "^CORS_ORIGIN=" ./backend/.env | nl
    else
        echo "   ✅ CORS_ORIGIN definido 1 vez"
    fi
fi
echo ""

# 5. Probar endpoint de salud
echo "5️⃣ PROBANDO ENDPOINT DE SALUD:"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/api/v1/health 2>/dev/null || echo "ERROR")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "   ✅ Backend responde correctamente (200)"
elif [ "$HEALTH_RESPONSE" = "ERROR" ]; then
    echo "   ❌ No se pudo conectar al backend"
    echo "   Verifica que esté corriendo en puerto 9000"
else
    echo "   ⚠️ Backend responde con código: $HEALTH_RESPONSE"
fi
echo ""

# 6. Verificar logs recientes
echo "6️⃣ LOGS RECIENTES:"
if [ -f "./backend/logs/app.log" ]; then
    echo "   Últimas 5 líneas del log:"
    tail -5 ./backend/logs/app.log | sed 's/^/   /'
elif [ -f "./backend.log" ]; then
    echo "   Últimas 5 líneas del log:"
    tail -5 ./backend.log | sed 's/^/   /'
else
    echo "   ℹ️ No se encontró archivo de log"
fi
echo ""

# 7. Recomendaciones
echo "7️⃣ RECOMENDACIONES:"
if [ -z "$BACKEND_PID" ]; then
    echo "   ⚠️ Iniciar el backend"
fi

if [ "$FRONTEND_URL_VALUE" != "https://tecnoandamio.huelemu.com.ar" ]; then
    echo "   ⚠️ FRONTEND_URL debe ser: https://tecnoandamio.huelemu.com.ar"
    echo "   Valor actual: $FRONTEND_URL_VALUE"
fi

if [ "$NODE_ENV_VALUE" != "production" ]; then
    echo "   ⚠️ NODE_ENV debe ser: production"
    echo "   Valor actual: $NODE_ENV_VALUE"
fi

if [[ "$JWT_SECRET_VALUE" == *"undefined"* ]]; then
    echo "   ❌ JWT_SECRET no está definido"
fi

echo ""
echo "=========================================="
echo "Verificación completada"
echo "=========================================="
