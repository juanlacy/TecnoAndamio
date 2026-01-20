#!/bin/bash

##############################################
# Script de Actualización - TecnoAndamio
# Uso: ./update.sh
##############################################

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 Actualizando TecnoAndamio${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Git Pull
echo -e "${YELLOW}📥 Pulling cambios desde Git...${NC}"
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Pull exitoso${NC}"
else
    echo -e "${RED}✗ Error en git pull${NC}"
    exit 1
fi
echo ""

# 2. Actualizar Backend
echo -e "${YELLOW}📦 Actualizando Backend...${NC}"
cd backend

# Instalar dependencias
echo "   - Instalando dependencias npm..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✓ Dependencias instaladas${NC}"
else
    echo -e "${RED}   ✗ Error instalando dependencias${NC}"
    exit 1
fi

# Reiniciar PM2
echo "   - Reiniciando proceso PM2..."
pm2 restart tecnoandamio-backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✓ Backend reiniciado${NC}"
else
    echo -e "${YELLOW}   ⚠ PM2 no pudo reiniciar (¿primera vez?)${NC}"
fi

cd ..
echo ""

# 3. Actualizar Frontend
echo -e "${YELLOW}🎨 Building Frontend...${NC}"
cd frontend

# Instalar dependencias
echo "   - Instalando dependencias npm..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✓ Dependencias instaladas${NC}"
else
    echo -e "${RED}   ✗ Error instalando dependencias${NC}"
    exit 1
fi

# Build de producción
echo "   - Compilando para producción..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✓ Build exitoso${NC}"
else
    echo -e "${RED}   ✗ Error en build${NC}"
    exit 1
fi

# Verificar que exista el build
if [ -d "dist/frontend/browser" ]; then
    echo -e "${GREEN}   ✓ Archivos de build generados${NC}"
    ls -lh dist/frontend/browser/ | grep -E "index.html|main.*js"
else
    echo -e "${RED}   ✗ No se encontró la carpeta dist${NC}"
    exit 1
fi

cd ..
echo ""

# 4. Reload Nginx
echo -e "${YELLOW}🌐 Reloading Nginx...${NC}"
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✓ Configuración de Nginx válida${NC}"
    systemctl reload nginx || service nginx reload
    echo -e "${GREEN}   ✓ Nginx recargado${NC}"
else
    echo -e "${RED}   ✗ Error en configuración de Nginx${NC}"
    exit 1
fi
echo ""

# 5. Verificar estado
echo -e "${YELLOW}📊 Verificando estado...${NC}"
echo ""
echo -e "${BLUE}Backend (PM2):${NC}"
pm2 status
echo ""

echo -e "${BLUE}Nginx:${NC}"
systemctl status nginx --no-pager -l || service nginx status
echo ""

# 6. Prueba rápida
echo -e "${YELLOW}🧪 Prueba rápida...${NC}"
echo "   - Verificando backend..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/api/v1/health || echo "000")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}   ✓ Backend respondiendo${NC}"
else
    echo -e "${YELLOW}   ⚠ Backend no responde en puerto 9000 (status: $HEALTH_CHECK)${NC}"
fi

echo "   - Verificando frontend..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
if [ "$FRONTEND_CHECK" = "200" ]; then
    echo -e "${GREEN}   ✓ Frontend accesible${NC}"
else
    echo -e "${YELLOW}   ⚠ Frontend no accesible (status: $FRONTEND_CHECK)${NC}"
fi
echo ""

# 7. Resumen final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Actualización completada!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📝 Siguientes pasos:${NC}"
echo "   1. Verificar aplicación en el navegador"
echo "   2. Revisar logs si hay problemas:"
echo "      - Backend: pm2 logs tecnoandamio-backend"
echo "      - Nginx: tail -f /www/wwwlogs/tecnoandamio_error.log"
echo ""
