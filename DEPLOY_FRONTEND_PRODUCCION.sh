#!/bin/bash

# Script para desplegar frontend a producción
# Ejecutar desde tu máquina local (Windows/WSL)

echo "=========================================="
echo "🚀 DEPLOY FRONTEND - TecnoAndamio"
echo "=========================================="
echo ""

# Variables - ACTUALIZAR CON TUS VALORES
SERVER_USER="usuario"
SERVER_HOST="tecnoandamio.huelemu.com.ar"
SERVER_PATH="/var/www/tecnoandamio"
LOCAL_BUILD_PATH="frontend/dist/frontend/browser"

# Verificar que existe el build
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "❌ Error: No se encontró el build en $LOCAL_BUILD_PATH"
    echo "Ejecuta primero: cd frontend && npm run build"
    exit 1
fi

echo "✅ Build encontrado en $LOCAL_BUILD_PATH"
echo ""

# Mostrar archivos a copiar
echo "📦 Archivos a copiar:"
ls -lh $LOCAL_BUILD_PATH/*.js | wc -l | xargs echo "   - Archivos JS:"
ls -lh $LOCAL_BUILD_PATH/*.css | wc -l | xargs echo "   - Archivos CSS:"
echo ""

# Confirmar deploy
read -p "¿Desplegar a $SERVER_HOST? (s/n): " confirm
if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "Deploy cancelado."
    exit 0
fi

echo ""
echo "1️⃣ Creando backup en el servidor..."
ssh $SERVER_USER@$SERVER_HOST "cd /var/www && sudo tar -czf tecnoandamio-backup-\$(date +%Y%m%d-%H%M%S).tar.gz tecnoandamio/"

if [ $? -eq 0 ]; then
    echo "   ✅ Backup creado"
else
    echo "   ⚠️ Error creando backup (continuando de todas formas)"
fi

echo ""
echo "2️⃣ Copiando archivos al servidor..."

# Opción A: Usar rsync (más rápido y eficiente)
if command -v rsync &> /dev/null; then
    echo "   Usando rsync..."
    rsync -avz --delete \
        --exclude='.gitkeep' \
        $LOCAL_BUILD_PATH/ \
        $SERVER_USER@$SERVER_HOST:/tmp/frontend-new/

    if [ $? -eq 0 ]; then
        echo "   ✅ Archivos copiados a /tmp/frontend-new/"
    else
        echo "   ❌ Error copiando archivos"
        exit 1
    fi
else
    # Opción B: Usar scp (fallback)
    echo "   Usando scp..."
    scp -r $LOCAL_BUILD_PATH/* $SERVER_USER@$SERVER_HOST:/tmp/frontend-new/

    if [ $? -eq 0 ]; then
        echo "   ✅ Archivos copiados a /tmp/frontend-new/"
    else
        echo "   ❌ Error copiando archivos"
        exit 1
    fi
fi

echo ""
echo "3️⃣ Moviendo archivos a la ubicación final..."
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
    # Limpiar directorio de destino
    sudo rm -rf /var/www/tecnoandamio/*

    # Copiar archivos nuevos
    sudo cp -r /tmp/frontend-new/* /var/www/tecnoandamio/

    # Ajustar permisos
    sudo chown -R www-data:www-data /var/www/tecnoandamio/
    sudo chmod -R 755 /var/www/tecnoandamio/

    # Limpiar temporal
    rm -rf /tmp/frontend-new/

    # Verificar archivos
    echo "Archivos en producción:"
    ls -lh /var/www/tecnoandamio/*.js | head -5
ENDSSH

if [ $? -eq 0 ]; then
    echo "   ✅ Archivos movidos correctamente"
else
    echo "   ❌ Error moviendo archivos"
    exit 1
fi

echo ""
echo "4️⃣ Reiniciando nginx..."
ssh $SERVER_USER@$SERVER_HOST "sudo nginx -t && sudo systemctl reload nginx"

if [ $? -eq 0 ]; then
    echo "   ✅ Nginx reiniciado"
else
    echo "   ⚠️ Error reiniciando nginx"
fi

echo ""
echo "=========================================="
echo "✅ DEPLOY COMPLETADO"
echo "=========================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Abre https://tecnoandamio.huelemu.com.ar en el navegador"
echo "2. Presiona Ctrl + Shift + Delete"
echo "3. Borra 'Cached images and files'"
echo "4. Presiona Ctrl + F5 (hard refresh)"
echo "5. Si ya habías hecho login, ejecuta en consola (F12):"
echo "   localStorage.clear(); location.reload();"
echo "6. Haz login nuevamente con demo@demo.com / demo123"
echo ""
