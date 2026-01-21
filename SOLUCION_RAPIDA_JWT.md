# 🚀 Solución Rápida - Error 401 JWT

## ❌ Problema
```
GET /api/v1/auth/me 401 (Unauthorized)
GET /api/v1/obras 401 (Unauthorized)
```

## ✅ Causa
**El backend en producción no tiene configurado el JWT_SECRET correctamente.**

---

## 🔧 Solución (5 minutos)

### 1. Conectar al Servidor
```bash
ssh usuario@tecnoandamio.huelemu.com.ar
```

### 2. Generar JWT_SECRET Seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Copia el resultado** (algo como: `a3f8b2c5d9e1f4a7b8c6...`)

### 3. Ir al Directorio del Backend
```bash
cd /ruta/al/proyecto/TecnoAndamio/backend
```

### 4. Crear/Editar .env
```bash
nano .env
```

**Pega este contenido (actualiza los valores marcados con ⬅️):**

```env
# Producción
NODE_ENV=production
PORT=9000

# Database - ACTUALIZAR ⬅️
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tecnoandamios_db
DB_USER=tu_usuario_db          # ⬅️ CAMBIAR
DB_PASSWORD=tu_password_db     # ⬅️ CAMBIAR

# JWT - PEGAR EL SECRET GENERADO ⬅️
JWT_SECRET=PEGAR_AQUI_EL_HASH_DEL_PASO_2    # ⬅️ CAMBIAR
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://tecnoandamio.huelemu.com.ar
FRONTEND_URL=https://tecnoandamio.huelemu.com.ar
```

**Guardar:** `Ctrl + O` → `Enter` → `Ctrl + X`

### 5. Permisos del Archivo
```bash
chmod 600 .env
```

### 6. Reiniciar Backend

**Opción A - PM2:**
```bash
pm2 restart tecnoandamio-backend
```

**Opción B - Systemd:**
```bash
sudo systemctl restart tecnoandamio-backend
```

**Opción C - Manual:**
```bash
pkill -f "node.*backend"
cd /ruta/al/proyecto/TecnoAndamio/backend
node src/index.js &
```

### 7. Verificar que Funciona
```bash
node diagnose-jwt.js
```

**Debe mostrar:**
```
✅ JWT_SECRET personalizado configurado
✅ Token generado exitosamente
✅ Token verificado exitosamente
```

### 8. En el Navegador del Usuario

**Abrir consola (F12) y ejecutar:**
```javascript
localStorage.clear();
location.href = '/login';
```

**Luego hacer login:**
- Email: `demo@demo.com`
- Password: `demo123`

---

## ✅ Verificación Final

**En consola del navegador (F12):**
```javascript
fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Status:', d.success ? '✅ OK' : '❌ ERROR', d));
```

**Debería mostrar:**
```
Status: ✅ OK {success: true, data: {...}}
```

---

## 📋 Checklist Rápido

- [ ] JWT_SECRET generado y copiado
- [ ] Archivo .env creado en `/backend/.env`
- [ ] Variables DB_* actualizadas
- [ ] Backend reiniciado
- [ ] diagnose-jwt.js ejecutado correctamente
- [ ] localStorage.clear() en navegador
- [ ] Login realizado
- [ ] /auth/me responde 200 OK

---

## ⚠️ Nota Importante

Si cambias `JWT_SECRET`, **todos los tokens existentes se invalidan**. Esto es normal. Todos los usuarios deben:
1. Limpiar localStorage
2. Hacer login nuevamente

---

## 📞 ¿Sigue sin funcionar?

Ejecuta esto en el servidor y copia el resultado:

```bash
cd /ruta/al/proyecto/TecnoAndamio/backend
echo "=== .env existe? ===" && ls -la .env
echo "=== Contenido .env ===" && head -15 .env
echo "=== Variables cargadas ===" && node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDO ('+process.env.JWT_SECRET.length+' chars)' : 'NO DEFINIDO');"
echo "=== Backend corriendo? ===" && ps aux | grep node | grep -v grep
```

---

**Tiempo estimado:** 5 minutos
**Dificultad:** Baja
**Requiere reinicio:** Sí (backend solamente)
