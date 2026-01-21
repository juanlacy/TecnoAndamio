# 🔐 Configurar JWT en Producción

## 🎯 Problema Identificado

Los errores 401 (Unauthorized) se deben a que el backend en producción **NO tiene configurado correctamente el JWT_SECRET**.

### Síntomas:
```
GET https://tecnoandamio.huelemu.com.ar/api/v1/auth/me 401 (Unauthorized)
GET https://tecnoandamio.huelemu.com.ar/api/v1/obras 401 (Unauthorized)
```

### Causa Raíz:
- El archivo `.env` en producción probablemente:
  1. No existe
  2. Tiene `JWT_SECRET` por defecto o diferente al usado para generar los tokens
  3. No está siendo leído correctamente por el backend

---

## ✅ Solución Paso a Paso

### Paso 1: Generar JWT_SECRET Seguro

**En el servidor de producción, ejecuta:**

```bash
# Conectar al servidor
ssh usuario@tecnoandamio.huelemu.com.ar

# Generar un JWT_SECRET aleatorio y seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Esto generará algo como:**
```
a3f8b2c5d9e1f4a7b8c6d2e9f3a7b4c8d5e1f6a9b2c7d4e8f1a6b9c3d7e2f5a8b1c4d9e3f6a2b7c5d8e1f4a9b6c2d7
```

**Copia ese valor**, lo usaremos en el siguiente paso.

---

### Paso 2: Crear/Actualizar archivo .env en Producción

**En el servidor:**

```bash
# Ir al directorio del backend
cd /ruta/al/proyecto/TecnoAndamio/backend

# Hacer backup del .env actual (si existe)
cp .env .env.backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Crear nuevo archivo .env
nano .env
```

**Contenido del archivo .env (pega esto y actualiza los valores):**

```env
# ========================================
# PRODUCCIÓN - TecnoAndamio
# ========================================

# Server
NODE_ENV=production
PORT=9000

# Database - ACTUALIZA CON TUS VALORES
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tecnoandamios_db
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql

# JWT - PEGA AQUÍ EL SECRET GENERADO
JWT_SECRET=PEGAR_AQUI_EL_SECRET_GENERADO_EN_EL_PASO_1
JWT_EXPIRES_IN=24h

# CORS - Dominio de producción
CORS_ORIGIN=https://tecnoandamio.huelemu.com.ar
FRONTEND_URL=https://tecnoandamio.huelemu.com.ar
```

**Guarda el archivo:**
- Presiona `Ctrl + O` (guardar)
- Presiona `Enter`
- Presiona `Ctrl + X` (salir)

---

### Paso 3: Verificar Permisos del Archivo .env

```bash
# El archivo .env debe ser solo lectura para el owner
chmod 600 .env

# Verificar que se guardó correctamente
cat .env | head -20
```

---

### Paso 4: Reiniciar el Backend

**Opción A: Si usas PM2**
```bash
pm2 restart tecnoandamio-backend
pm2 logs tecnoandamio-backend --lines 50
```

**Opción B: Si usas systemd**
```bash
sudo systemctl restart tecnoandamio-backend
sudo journalctl -u tecnoandamio-backend -n 50 -f
```

**Opción C: Si ejecutas directamente**
```bash
# Detener el proceso actual
pkill -f "node.*backend"

# Iniciar de nuevo
cd /ruta/al/proyecto/TecnoAndamio/backend
nohup node src/index.js > backend.log 2>&1 &

# Ver logs
tail -f backend.log
```

---

### Paso 5: Ejecutar Script de Diagnóstico

```bash
cd /ruta/al/proyecto/TecnoAndamio/backend
node diagnose-jwt.js
```

**Deberías ver:**
```
🔍 DIAGNÓSTICO DE JWT - TecnoAndamio

1️⃣ VARIABLES DE ENTORNO:
   NODE_ENV: production
   PORT: 9000
   JWT_SECRET: ✅ DEFINIDO

2️⃣ JWT_SECRET ACTIVO:
   ✅ JWT_SECRET personalizado configurado
   Length: 128 caracteres

3️⃣ PRUEBA DE GENERACIÓN DE TOKEN:
   ✅ Token generado exitosamente

4️⃣ PRUEBA DE VERIFICACIÓN DE TOKEN:
   ✅ Token verificado exitosamente
```

---

### Paso 6: Limpiar Tokens Antiguos en el Navegador

**En el navegador del usuario:**

1. Abre la consola (F12)
2. Ejecuta:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

3. Haz login nuevamente:
   - Email: `demo@demo.com`
   - Password: `demo123`

---

### Paso 7: Verificar que Funciona

**En la consola del navegador (F12):**

```javascript
// Ejecuta el script de debug
// Copia y pega el contenido de DEBUG_JWT_COMPLETO.js
```

**Deberías ver:**
```
2️⃣ PROBANDO /api/v1/auth/me:
Status: 200
✅ Token válido

3️⃣ PROBANDO ENDPOINT DE LOGIN:
Status: 200
✅ LOGIN FUNCIONA CORRECTAMENTE
```

---

## 🐛 Troubleshooting

### Problema: Backend no lee el .env

**Verificar que dotenv está cargando:**

```bash
# En el servidor
cd /ruta/al/proyecto/TecnoAndamio/backend

# Agregar debug temporal
node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDO' : 'NO DEFINIDO');"
```

### Problema: Sigue dando 401 después de configurar

**Posibles causas:**

1. **El backend no se reinició correctamente**
   ```bash
   # Verificar que el proceso está corriendo
   ps aux | grep node

   # Ver si está usando el nuevo .env
   cat /proc/$(pgrep -f "node.*backend")/environ | tr '\0' '\n' | grep JWT_SECRET
   ```

2. **El .env está en el lugar incorrecto**
   ```bash
   # El .env debe estar en la raíz del directorio backend
   # NO en la raíz del proyecto
   ls -la /ruta/al/proyecto/TecnoAndamio/backend/.env
   ```

3. **Hay múltiples instancias del backend corriendo**
   ```bash
   # Matar todas las instancias
   pkill -f "node.*backend"

   # Esperar 5 segundos
   sleep 5

   # Iniciar solo una
   cd /ruta/al/proyecto/TecnoAndamio/backend
   node src/index.js
   ```

---

## 📋 Checklist de Configuración

- [ ] JWT_SECRET generado con 64+ bytes aleatorios
- [ ] Archivo .env creado en `/ruta/backend/.env`
- [ ] Variables DB_* configuradas correctamente
- [ ] CORS_ORIGIN apunta a `https://tecnoandamio.huelemu.com.ar`
- [ ] Permisos del .env configurados (chmod 600)
- [ ] Backend reiniciado
- [ ] Script diagnose-jwt.js ejecutado y pasa todas las pruebas
- [ ] localStorage limpiado en el navegador
- [ ] Login realizado nuevamente
- [ ] Endpoints responden 200 OK (no 401)

---

## 🔒 Seguridad Importante

1. **NUNCA commitear el .env a Git**
   ```bash
   # Verificar que está en .gitignore
   echo ".env" >> .gitignore
   echo ".env.*" >> .gitignore
   ```

2. **JWT_SECRET debe ser:**
   - Aleatorio (generado con crypto)
   - Largo (mínimo 64 caracteres)
   - Único para producción (diferente a desarrollo)
   - Secreto (nunca compartir)

3. **Si cambias JWT_SECRET:**
   - Todos los tokens antiguos se invalidan
   - Todos los usuarios deben hacer logout/login
   - Es el comportamiento esperado

---

## 📞 ¿Aún no funciona?

Ejecuta en el servidor:

```bash
cd /ruta/al/proyecto/TecnoAndamio/backend

# Debug completo
echo "=== Verificando .env ==="
ls -la .env
echo ""
echo "=== Primeras líneas del .env ==="
head -15 .env
echo ""
echo "=== Variables cargadas ==="
node -e "require('dotenv').config(); console.log('NODE_ENV:', process.env.NODE_ENV); console.log('JWT_SECRET definido:', !!process.env.JWT_SECRET); console.log('DB_NAME:', process.env.DB_NAME);"
echo ""
echo "=== Proceso backend ==="
ps aux | grep node | grep -v grep
```

Copia el output completo para análisis.

---

**Fecha:** 2026-01-20
**Causa:** JWT_SECRET no configurado en producción
**Solución:** Configurar .env correctamente y reiniciar backend
