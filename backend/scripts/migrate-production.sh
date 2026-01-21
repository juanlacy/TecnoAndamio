#!/bin/bash

# Script para ejecutar migraciones en PRODUCCIÓN de forma segura
# Uso: ./scripts/migrate-production.sh

set -e  # Salir si hay algún error

echo "================================================"
echo "  MIGRACIONES DE BASE DE DATOS - PRODUCCIÓN"
echo "================================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde el directorio backend/"
    exit 1
fi

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    echo "❌ Error: No existe archivo .env"
    echo "   Crea un archivo .env con las variables de producción"
    exit 1
fi

echo "⚠️  ADVERTENCIA: Estás a punto de ejecutar migraciones en PRODUCCIÓN"
echo ""
echo "Antes de continuar, asegúrate de:"
echo "  1. ✅ Tener un BACKUP reciente de la base de datos"
echo "  2. ✅ Haber probado las migraciones en desarrollo"
echo "  3. ✅ Tener acceso para revertir cambios si es necesario"
echo ""
read -p "¿Deseas continuar? (escribe 'SI' para confirmar): " confirmacion

if [ "$confirmacion" != "SI" ]; then
    echo "❌ Operación cancelada"
    exit 0
fi

echo ""
echo "📊 Estado actual de migraciones:"
echo "================================================"
NODE_ENV=production npx sequelize-cli db:migrate:status

echo ""
echo "⏳ Ejecutando migraciones pendientes..."
echo "================================================"

# Ejecutar migraciones
NODE_ENV=production npm run migrate

echo ""
echo "✅ Migraciones completadas!"
echo ""
echo "📊 Estado final de migraciones:"
echo "================================================"
NODE_ENV=production npx sequelize-cli db:migrate:status

echo ""
echo "✅ Proceso completado exitosamente"
echo ""
echo "💡 Recuerda:"
echo "  - Verificar que la aplicación funcione correctamente"
echo "  - Revisar los logs por posibles errores"
echo "  - Mantener el backup por si necesitas revertir"
echo ""
