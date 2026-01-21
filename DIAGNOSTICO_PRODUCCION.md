# 🔍 Diagnóstico de Producción - tecnoandamio.huelemu.com.ar

**Fecha:** 2026-01-20
**Dominio:** https://tecnoandamio.huelemu.com.ar

---

## ✅ Estado Actual

### Frontend
- ✅ **Sitio accesible:** https://tecnoandamio.huelemu.com.ar
- ✅ **Servidor:** nginx
- ✅ **Archivos desplegados correctamente**

### Backend API
- ✅ **Endpoint respondiendo:** `/api/v1/auth/login`
- ✅ **Respuesta correcta del servidor**
- ✅ **JSON válido retornado**

**Prueba realizada:**
```bash
curl -X POST https://tecnoandamio.huelemu.com.ar/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}'

# Respuesta:
{
  "success": false,
  "error": {
    "message": "Credenciales inválidas",
    "code": "UNAUTHORIZED"
  }
}
```

✅ **Esto confirma que el backend ESTÁ funcionando correctamente.**

---

## ⚠️ Problema Reportado

**Usuario dice:** "Logro entrar con el usuario demo pero pareciera que no valida con el Back o que tiene errores"

### Posibles Causas:

1. **Credenciales incorrectas**
   - Usuario demo no existe en la BD de producción
   - Contraseña incorrecta

2. **Errores en consola del navegador**
   - CORS
   - Network errors
   - JavaScript errors

3. **Token JWT inválido o expirado**

4. **Base de datos vacía o sin usuarios**

---

## 🔍 Pasos de Diagnóstico

### 1. Verificar Usuario Demo en Base de Datos

**Conectar a la BD de producción y verificar:**

```sql
-- Ver si existe el usuario demo
SELECT * FROM usuarios WHERE email LIKE '%demo%';

-- Ver todos los usuarios
SELECT id, nombre, email, rol, activo FROM usuarios;

-- Si no existe, crear usuario demo
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES (
  'Usuario Demo',
  'demo@demo.com',
  -- Hash de 'demo123' usando bcrypt
  '$2b$10$...',
  'admin',
  1
);
```

### 2. Verificar Errores en Consola del Navegador

**Abrir DevTools en:** https://tecnoandamio.huelemu.com.ar

**Presionar F12 → Console**

Buscar errores tipo:
- ❌ `CORS policy`
- ❌ `Failed to fetch`
- ❌ `401 Unauthorized`
- ❌ `500 Internal Server Error`
- ❌ `NetworkError`

### 3. Verificar Request en Network Tab

**F12 → Network → intentar login**

Verificar:
- ✅ Request a `/api/v1/auth/login` se envía
- ✅ Status code (200, 401, 500, etc.)
- ✅ Response body
- ✅ Request headers (Content-Type, etc.)
- ✅ CORS headers

---

## 🛠️ Soluciones Según el Problema

### Problema 1: Usuario demo no existe

**Solución:** Crear usuario en la BD

```sql
-- Generar hash de contraseña (usando bcrypt)
-- Password: demo123
INSERT INTO usuarios (nombre, email, password, rol, activo, created_at, updated_at)
VALUES (
  'Usuario Demo',
  'demo@demo.com',
  '$2b$10$YourHashedPasswordHere',
  'admin',
  1,
  NOW(),
  NOW()
);
```

**O usar un endpoint de seed si existe:**
```bash
curl -X POST https://tecnoandamio.huelemu.com.ar/api/v1/seed/usuarios
```

---

### Problema 2: Error CORS

**Síntomas:**
```
Access to XMLHttpRequest at 'https://...' has been blocked by CORS policy
```

**Solución:** Configurar CORS en el backend

**En el archivo del backend (Express.js):**
```javascript
// backend/src/server.js o app.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://tecnoandamio.huelemu.com.ar',
    'http://localhost:9200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**O en nginx:**
```nginx
# /etc/nginx/sites-available/tecnoandamio
location /api/ {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }

    proxy_pass http://localhost:9000;
}
```

---

### Problema 3: Configuración incorrecta de API URL

**Verificar en producción:**

El archivo `environment.prod.ts` tiene:
```typescript
apiUrl: '/api/v1'
```

Esto significa que las peticiones van a:
```
https://tecnoandamio.huelemu.com.ar/api/v1/auth/login
```

**Si el backend está en otro dominio**, cambiar a:
```typescript
apiUrl: 'https://api.tecnoandamio.huelemu.com.ar/api/v1'
```

---

### Problema 4: JWT Token expirado o inválido

**Síntomas:**
- Login exitoso inicial
- Luego errores 401 en otras peticiones

**Solución:** Limpiar localStorage y volver a hacer login

**En consola del navegador:**
```javascript
localStorage.clear();
location.reload();
```

---

## 📋 Checklist de Verificación

### En el Navegador (F12 → Console)

```javascript
// 1. Verificar configuración actual
console.log('API URL:', 'Revisar en Network tab');

// 2. Verificar localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// 3. Limpiar y reintentar
localStorage.clear();
// Hacer login de nuevo
```

### En el Network Tab

Al hacer login, debería ver:

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@demo.com",
  "password": "demo123"
}
```

**Response (exitoso):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "usuario": {
      "id": 1,
      "nombre": "Usuario Demo",
      "email": "demo@demo.com",
      "rol": "admin",
      "activo": true
    }
  }
}
```

**Response (error):**
```json
{
  "success": false,
  "error": {
    "message": "Credenciales inválidas",
    "code": "UNAUTHORIZED"
  }
}
```

---

## 🔧 Script de Diagnóstico Rápido

**Ejecutar en la consola del navegador:**

```javascript
// Script de diagnóstico completo
console.log('=== DIAGNÓSTICO TECNOANDAMIO ===\n');

// 1. Estado de autenticación
const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
console.log('1. Usuario guardado:', user ? '✅ Sí' : '❌ No');
console.log('   Token guardado:', token ? '✅ Sí' : '❌ No');

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('   Nombre:', userData.nombre);
    console.log('   Email:', userData.email);
    console.log('   Rol:', userData.rol);
  } catch(e) {
    console.error('   ❌ Error parseando usuario');
  }
}

// 2. Probar conectividad al backend
console.log('\n2. Probando backend...');
fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test', password: 'test' })
})
.then(r => r.json())
.then(data => {
  console.log('   ✅ Backend responde:', data);
})
.catch(err => {
  console.error('   ❌ Error de conexión:', err);
});

// 3. Verificar errores en consola
console.log('\n3. Buscar errores arriba en la consola');
console.log('   Si hay errores CORS: problema de configuración');
console.log('   Si hay 401: credenciales incorrectas');
console.log('   Si hay 500: error en el servidor');
```

---

## 🚀 Solución Rápida Recomendada

### Paso 1: Verificar credenciales

Asegurarse de usar las credenciales correctas de producción.

**Credenciales esperadas:**
```
Email: admin@tecnoandamios.cl
Password: [la contraseña configurada en producción]
```

### Paso 2: Si no sabes la contraseña

**Opción A:** Resetear en la BD
```sql
UPDATE usuarios
SET password = '$2b$10$...' -- Hash de nueva contraseña
WHERE email = 'admin@tecnoandamios.cl';
```

**Opción B:** Crear nuevo usuario admin
```sql
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES ('Admin', 'admin@demo.com', '$2b$10$...', 'admin', 1);
```

### Paso 3: Probar login en producción

1. Ir a: https://tecnoandamio.huelemu.com.ar/login
2. Ingresar credenciales correctas
3. Verificar en Network tab que la respuesta sea `success: true`
4. Verificar que se guarde en localStorage

---

## 📞 Información de Contacto para Debugging

Si el problema persiste, necesito saber:

1. **¿Qué error exacto ves en la consola?**
   - Screenshot de Console (F12)
   - Screenshot de Network tab

2. **¿Qué credenciales estás usando?**
   - Email del usuario
   - (NO envíes la contraseña)

3. **¿La respuesta del backend?**
   - Ver en Network tab → Response

4. **¿Estado de localStorage?**
   ```javascript
   console.log(localStorage.getItem('user'));
   console.log(localStorage.getItem('token'));
   ```

---

## ✅ Resumen

**El backend ESTÁ funcionando** en https://tecnoandamio.huelemu.com.ar/api/v1

**Problema probable:**
- ❌ Credenciales incorrectas (usuario demo no existe en producción)
- ❌ Base de datos vacía o sin usuarios creados

**Solución:**
1. Crear usuario demo en la BD de producción
2. O usar las credenciales correctas de admin

---

**Última verificación:** 2026-01-20
**Estado:** Backend OK ✅ | Frontend OK ✅ | Credenciales ❓
