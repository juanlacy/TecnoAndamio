#!/bin/bash

# Script de Migración de Dependencias - TecnoAndamios Backend
# Este script actualiza el proyecto a las últimas versiones sin dependencias deprecadas

echo "======================================"
echo "🔄 Migración de Dependencias"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Por favor ejecutá este script desde el directorio backend/"
    exit 1
fi

echo -e "${YELLOW}📦 Paso 1: Backup del package.json actual${NC}"
cp package.json package.json.backup
echo -e "${GREEN}✓${NC} Backup creado: package.json.backup"
echo ""

echo -e "${YELLOW}🗑️  Paso 2: Eliminando node_modules y package-lock.json${NC}"
rm -rf node_modules package-lock.json
echo -e "${GREEN}✓${NC} Archivos antiguos eliminados"
echo ""

echo -e "${YELLOW}📥 Paso 3: Instalando dependencias actualizadas${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencias instaladas correctamente"
else
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    echo "Restaurando backup..."
    mv package.json.backup package.json
    exit 1
fi
echo ""

echo -e "${YELLOW}🔍 Paso 4: Verificando vulnerabilidades${NC}"
npm audit
AUDIT_RESULT=$?
if [ $AUDIT_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Sin vulnerabilidades detectadas"
else
    echo -e "${YELLOW}⚠️  Hay algunas vulnerabilidades. Intentando fix automático...${NC}"
    npm audit fix
fi
echo ""

echo -e "${YELLOW}🧹 Paso 5: Verificando ESLint${NC}"
if [ -f "eslint.config.js" ]; then
    npm run lint
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} ESLint configurado correctamente"
    else
        echo -e "${YELLOW}⚠️  Hay algunos errores de lint. Ejecutá 'npm run lint:fix' para corregirlos${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No se encontró eslint.config.js${NC}"
    echo "Creá el archivo siguiendo la guía en DEPENDENCY_UPDATES.md"
fi
echo ""

echo -e "${YELLOW}🧪 Paso 6: Verificando configuración de Jest${NC}"
if [ -f "jest.config.js" ]; then
    echo -e "${GREEN}✓${NC} Jest configurado"
else
    echo -e "${YELLOW}⚠️  No se encontró jest.config.js${NC}"
    echo "Creá el archivo siguiendo la guía en DEPENDENCY_UPDATES.md"
fi
echo ""

echo -e "${YELLOW}📊 Paso 7: Reporte de paquetes${NC}"
echo "Versiones instaladas:"
echo "  - Express: $(npm list express --depth=0 2>/dev/null | grep express | awk '{print $2}')"
echo "  - Sequelize: $(npm list sequelize --depth=0 2>/dev/null | grep sequelize | awk '{print $2}')"
echo "  - MySQL2: $(npm list mysql2 --depth=0 2>/dev/null | grep mysql2 | awk '{print $2}')"
echo "  - dayjs: $(npm list dayjs --depth=0 2>/dev/null | grep dayjs | awk '{print $2}')"
echo "  - ESLint: $(npm list eslint --depth=0 2>/dev/null | grep eslint | awk '{print $2}')"
echo ""

echo "======================================"
echo -e "${GREEN}✅ Migración Completada${NC}"
echo "======================================"
echo ""
echo "Próximos pasos:"
echo "1. Verificá que tengas los archivos de configuración:"
echo "   - eslint.config.js"
echo "   - .prettierrc"
echo "   - jest.config.js"
echo ""
echo "2. Si usabas 'moment', reemplazalo por 'dayjs':"
echo "   - import dayjs from 'dayjs';"
echo "   - dayjs().format('YYYY-MM-DD')"
echo ""
echo "3. Ejecutá los tests:"
echo "   npm test"
echo ""
echo "4. Iniciá el servidor:"
echo "   npm run dev"
echo ""
echo "📚 Consultá DEPENDENCY_UPDATES.md para más detalles"
echo ""
