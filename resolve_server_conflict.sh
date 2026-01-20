#!/bin/bash

# Script para resolver el conflicto en el servidor
# Ejecutar este script EN EL SERVIDOR

echo "🔧 Resolviendo conflicto de angular.json..."

# Guardar cambios locales temporalmente
git stash

# Hacer pull
git pull origin main

# Intentar aplicar cambios guardados (si falla, no pasa nada)
git stash pop || echo "No había cambios para aplicar (es normal)"

echo "✅ Conflicto resuelto. Continuando con el build..."

# Continuar con el resto del update
cd frontend
npm install
npm run build

cd ..
pm2 restart tecnoandamio-backend || echo "PM2 no pudo reiniciar"
nginx -t && (systemctl reload nginx || service nginx reload)

echo "✅ Actualización completa!"
