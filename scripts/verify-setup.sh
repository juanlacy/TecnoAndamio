#!/bin/bash

# Script de verificación del setup de TecnoAndamios
# Verifica que todos los prerequisitos estén instalados

echo "======================================"
echo "🔍 Verificador de Setup - TecnoAndamios"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASS=0
FAIL=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

# Verificar Node.js
echo "Verificando Node.js..."
node --version > /dev/null 2>&1
check "Node.js instalado: $(node --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar npm
echo "Verificando npm..."
npm --version > /dev/null 2>&1
check "npm instalado: $(npm --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar Git
echo "Verificando Git..."
git --version > /dev/null 2>&1
check "Git instalado: $(git --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar Docker
echo "Verificando Docker..."
docker --version > /dev/null 2>&1
check "Docker instalado: $(docker --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar Docker Compose
echo "Verificando Docker Compose..."
docker-compose --version > /dev/null 2>&1
check "Docker Compose instalado: $(docker-compose --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar MySQL (solo si no usa Docker)
echo "Verificando MySQL..."
mysql --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check "MySQL instalado: $(mysql --version 2>/dev/null | head -n1)"
else
    echo -e "${YELLOW}⚠${NC} MySQL no instalado (opcional si usás Docker)"
fi

# Verificar Claude Code
echo "Verificando Claude Code..."
claude-code --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check "Claude Code instalado: $(claude-code --version 2>/dev/null)"
else
    echo -e "${YELLOW}⚠${NC} Claude Code no instalado (opcional pero recomendado)"
fi

# Verificar estructura del proyecto
echo ""
echo "Verificando estructura del proyecto..."
[ -d "backend" ] && echo -e "${GREEN}✓${NC} Directorio backend existe" || echo -e "${RED}✗${NC} Directorio backend NO existe"
[ -d "frontend" ] && echo -e "${GREEN}✓${NC} Directorio frontend existe" || echo -e "${RED}✗${NC} Directorio frontend NO existe"
[ -d "docs" ] && echo -e "${GREEN}✓${NC} Directorio docs existe" || echo -e "${RED}✗${NC} Directorio docs NO existe"
[ -f "docker-compose.yml" ] && echo -e "${GREEN}✓${NC} docker-compose.yml existe" || echo -e "${RED}✗${NC} docker-compose.yml NO existe"
[ -f "README.md" ] && echo -e "${GREEN}✓${NC} README.md existe" || echo -e "${RED}✗${NC} README.md NO existe"

# Verificar configuración backend
echo ""
echo "Verificando configuración backend..."
[ -f "backend/.env" ] && echo -e "${GREEN}✓${NC} backend/.env configurado" || echo -e "${YELLOW}⚠${NC} backend/.env NO existe (copiar de .env.example)"
[ -f "backend/package.json" ] && echo -e "${GREEN}✓${NC} backend/package.json existe" || echo -e "${RED}✗${NC} backend/package.json NO existe"

# Verificar si los node_modules están instalados
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencias backend instaladas"
else
    echo -e "${YELLOW}⚠${NC} Dependencias backend NO instaladas (ejecutar: cd backend && npm install)"
fi

# Verificar puertos disponibles
echo ""
echo "Verificando puertos..."
lsof -i:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${RED}✗${NC} Puerto 3000 (backend) está en uso"
else
    echo -e "${GREEN}✓${NC} Puerto 3000 (backend) disponible"
fi

lsof -i:4200 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${RED}✗${NC} Puerto 4200 (frontend) está en uso"
else
    echo -e "${GREEN}✓${NC} Puerto 4200 (frontend) disponible"
fi

lsof -i:3306 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${YELLOW}⚠${NC} Puerto 3306 (MySQL) está en uso (verificar si es tu MySQL o Docker)"
else
    echo -e "${GREEN}✓${NC} Puerto 3306 (MySQL) disponible"
fi

# Resumen
echo ""
echo "======================================"
echo "📊 Resumen"
echo "======================================"
echo -e "Verificaciones exitosas: ${GREEN}${PASS}${NC}"
echo -e "Verificaciones fallidas: ${RED}${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ¡Todo listo para empezar a desarrollar!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. cd backend && npm install"
    echo "2. cp backend/.env.example backend/.env"
    echo "3. Configurar backend/.env con tus credenciales"
    echo "4. docker-compose up -d"
    echo "   O manualmente: npm run migrate && npm run seed && npm run dev"
else
    echo -e "${YELLOW}⚠️  Hay algunos prerequisitos faltantes${NC}"
    echo ""
    echo "Revisa la documentación en docs/SETUP.md para instrucciones detalladas"
fi

echo ""
echo "======================================"
