# 🔍 Diagnóstico Backend - Error 500 en /api/v1/obras

## 📋 Problema

**Error en consola del navegador:**
```
HTTP Error: Error interno del servidor.
Status: 500
URL: https://tecnoandamio.huelemu.com.ar/api/v1/obras
```

**Síntomas:**
1. ✅ Login funciona correctamente
2. ❌ No se ve módulo "Usuarios" en el menú
3. ❌ Al entrar a "Obras" aparece error 500

---

## 🔍 Causa Probable

El backend está en modo **producción** (`NODE_ENV=production`), por lo que el middleware de error retorna mensaje genérico en lugar del error real.

**Posibles causas del error 500:**

1. **Base de datos:** Alguna tabla o columna no existe
2. **Relaciones Sequelize:** El modelo de Obra tiene relaciones con Usuario que fallan
3. **Permisos:** El middleware verifica permisos que el usuario no tiene
4. **Datos corruptos:** Hay registros con datos inválidos

---

## 🚀 Pasos de Diagnóstico

### 1. Ver logs del backend en producción

**Si usas PM2:**
```bash
pm2 logs backend --lines 50
```

**Si usas systemd:**
```bash
sudo journalctl -u tecnoandamio-backend -n 50 --no-pager
```

**Si los logs van a archivo:**
```bash
tail -f /var/log/tecnoandamio/backend.log
# o
tail -f ~/logs/backend.log
```

**Luego intenta cargar obras en el navegador y mira qué error aparece.**

---

### 2. Verificar estructura de la tabla obras

Conecta a la BD y ejecuta:

```sql
-- Ver estructura de la tabla obras
DESCRIBE obras;

-- Ver si hay obras en la BD
SELECT COUNT(*) FROM obras;

-- Ver una obra de ejemplo
SELECT * FROM obras LIMIT 1;

-- Verificar relaciones con usuarios
SELECT
    o.id,
    o.nombre,
    o.responsable_id,
    u.nombre as responsable_nombre
FROM obras o
LEFT JOIN usuarios u ON o.responsable_id = u.id
LIMIT 5;
```

---

### 3. Probar endpoint directamente

**Usando curl:**
```bash
# Primero haz login para obtener el token
curl -X POST https://tecnoandamio.huelemu.com.ar/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@demo.com","password":"demo123"}' | jq

# Copia el token de la respuesta y úsalo aquí:
TOKEN="eyJhbGc..."

# Prueba obtener obras
curl -X GET https://tecnoandamio.huelemu.com.ar/api/v1/obras \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

---

### 4. Habilitar logs de desarrollo temporalmente

Si tienes acceso al servidor, edita el archivo `.env` del backend:

```bash
# Editar .env en producción
cd /ruta/al/backend
nano .env
```

**Cambiar temporalmente:**
```env
# De:
NODE_ENV=production

# A:
NODE_ENV=development
```

**Reiniciar el backend:**
```bash
pm2 restart backend
# o
sudo systemctl restart tecnoandamio-backend
```

**Ahora intenta cargar obras** y el error mostrará el mensaje completo en lugar de "Error interno del servidor".

**⚠️ IMPORTANTE:** Vuelve a poner `NODE_ENV=production` después de diagnosticar.

---

### 5. Verificar que el rol 'admin' tiene permisos

Puede que el backend esté verificando permisos específicos. Verifica:

```sql
-- Ver permisos del rol admin
SELECT * FROM roles WHERE nombre = 'admin';

-- Ver si el campo 'permisos' tiene contenido JSON
SELECT nombre, permisos FROM roles WHERE nombre = 'admin';
```

Si el campo `permisos` está vacío o NULL, puede que necesites configurarlo.

---

## 🔧 Soluciones Probables

### Solución 1: Si falta la tabla obras

```sql
-- Verificar si existe la tabla
SHOW TABLES LIKE 'obras';

-- Si no existe, ejecutar migraciones
```

En el servidor:
```bash
cd /ruta/al/backend
npm run migrate
```

---

### Solución 2: Si hay problemas con relaciones

El modelo de Obra probablemente tiene esta relación:

```javascript
// backend/src/models/Obra.js
Obra.belongsTo(Usuario, {
  foreignKey: 'responsable_id',
  as: 'responsable'
});
```

Verifica que:
1. La columna `responsable_id` existe en la tabla `obras`
2. Hay usuarios en la tabla `usuarios`
3. El `responsable_id` referencia a usuarios válidos

```sql
-- Verificar si hay obras con responsable_id inválido
SELECT o.id, o.nombre, o.responsable_id
FROM obras o
LEFT JOIN usuarios u ON o.responsable_id = u.id
WHERE o.responsable_id IS NOT NULL
  AND u.id IS NULL;
```

---

### Solución 3: Si el problema es permisos del rol

Actualiza los permisos del rol admin:

```sql
UPDATE roles
SET permisos = JSON_OBJECT(
    'obras', JSON_ARRAY('read', 'create', 'update', 'delete'),
    'usuarios', JSON_ARRAY('read', 'create', 'update', 'delete'),
    'clientes', JSON_ARRAY('read', 'create', 'update', 'delete'),
    'equipos', JSON_ARRAY('read', 'create', 'update', 'delete'),
    'edps', JSON_ARRAY('read', 'create', 'update', 'delete')
)
WHERE nombre = 'admin';
```

---

### Solución 4: Problema con el menú de "Usuarios"

El menú de usuarios no aparece porque el `sidebar.ts` verifica roles. Revisa qué está llegando al frontend:

**En la consola del navegador (F12), ejecuta:**
```javascript
// Ver qué datos tiene el usuario
const user = JSON.parse(localStorage.getItem('user'));
console.log('User data:', user);
console.log('Roles:', user.roles);
```

**Debería mostrar:**
```javascript
{
  id: X,
  nombre: "Usuario Demo",
  email: "demo@demo.com",
  roles: ["admin"],  // <-- Debe ser un array
  activo: true
}
```

Si `roles` NO es un array, el problema está en el backend al serializar el usuario.

---

## 📊 Checklist de Verificación

- [ ] Ver logs del backend en producción
- [ ] Verificar que tabla `obras` existe
- [ ] Verificar que hay datos en `obras`
- [ ] Probar endpoint con curl
- [ ] Verificar relaciones con `usuarios`
- [ ] Verificar que rol 'admin' existe y tiene permisos
- [ ] Verificar que `user.roles` es un array en localStorage
- [ ] Cambiar temporalmente a `NODE_ENV=development` para ver error completo

---

## 🎯 Siguiente Paso

**Opción A - Rápida:** Ver logs del backend

**Opción B - Completa:** Cambiar a modo development y reproducir el error

**Opción C - Diagnóstico SQL:** Ejecutar las consultas SQL de verificación

---

**Fecha:** 2026-01-20
**Usuario afectado:** demo@demo.com
**Endpoint con error:** GET /api/v1/obras
