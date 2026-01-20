# 🔐 Instrucciones para Crear Usuario Demo en Producción

## ✅ Resumen del Problema

**Situación actual:**
- Frontend: ✅ Funcionando en https://tecnoandamio.huelemu.com.ar
- Backend: ✅ Funcionando correctamente
- Usuario demo: ❌ NO EXISTE en la base de datos de producción

**Solución:** Ejecutar el script SQL para crear el usuario demo

---

## 📋 Credenciales del Usuario Demo

```
Email:    demo@demo.com
Password: demo123
Rol:      admin
Estado:   Activo
```

---

## 🚀 Pasos para Crear el Usuario

### Opción 1: Ejecutar el Script SQL Completo

1. **Conectarte a la base de datos de producción**
   ```bash
   mysql -u tu_usuario -p nombre_base_datos
   ```

2. **Ejecutar el archivo SQL**
   ```bash
   mysql -u tu_usuario -p nombre_base_datos < CREAR_USUARIO_DEMO.sql
   ```

   O copiando el contenido del archivo `CREAR_USUARIO_DEMO.sql` directamente en tu cliente MySQL.

### Opción 2: Ejecutar Solo los Comandos Necesarios

Si prefieres ejecutar solo los comandos necesarios, copia y pega esto en tu cliente MySQL:

**⚠️ IMPORTANTE:** La tabla `usuarios` NO tiene columna `rol`. Los roles se asignan mediante la tabla `usuario_roles`.

```sql
-- 1. Crear el usuario
INSERT INTO usuarios (nombre, email, password_hash, activo, created_at, updated_at)
SELECT
    'Usuario Demo',
    'demo@demo.com',
    '$2a$10$Ubb22cEtMlooareVJaMISOGKKx10gUU7aSwVm1KpW7Xf77KojVMCm',
    1,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'demo@demo.com'
);

-- 2. Asignar rol 'admin' al usuario demo
INSERT INTO usuario_roles (usuario_id, rol_id, asignado_en)
SELECT
    u.id,
    r.id,
    NOW()
FROM usuarios u
CROSS JOIN roles r
WHERE u.email = 'demo@demo.com'
  AND r.nombre = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM usuario_roles ur
    WHERE ur.usuario_id = u.id AND ur.rol_id = r.id
  );
```

**Notas importantes:**
- La columna de password se llama `password_hash` (no `password`)
- La tabla `usuarios` NO tiene columna `rol`
- Los roles se asignan en la tabla `usuario_roles` (relación M:N)
- Estos comandos NO crearán duplicados

---

## ✅ Verificar que Funcionó

### 1. Verificar en la Base de Datos

Ejecuta esta consulta para ver el usuario con sus roles:

```sql
SELECT
    u.id,
    u.nombre,
    u.email,
    u.activo,
    u.created_at,
    GROUP_CONCAT(r.nombre) as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.id
WHERE u.email = 'demo@demo.com'
GROUP BY u.id, u.nombre, u.email, u.activo, u.created_at;
```

**Deberías ver:**
```
+----+-------------+----------------+--------+---------------------+-------+
| id | nombre      | email          | activo | created_at          | roles |
+----+-------------+----------------+--------+---------------------+-------+
|  X | Usuario Demo| demo@demo.com  |      1 | 2026-01-20 XX:XX:XX | admin |
+----+-------------+----------------+--------+---------------------+-------+
```

### 2. Probar Login en la Web

1. Ve a: https://tecnoandamio.huelemu.com.ar/login

2. Ingresa las credenciales:
   - **Email:** `demo@demo.com`
   - **Password:** `demo123`

3. Haz clic en "Iniciar Sesión"

4. **Resultado esperado:**
   - ✅ Deberías ser redirigido al dashboard
   - ✅ En la esquina superior derecha debería aparecer "Usuario Demo"
   - ✅ Deberías ver el menú de navegación con todas las opciones (Obras, Usuarios, etc.)

### 3. Verificar en la Consola del Navegador (F12)

Después de hacer login exitoso, ejecuta en la consola:

```javascript
console.log('User:', localStorage.getItem('user'));
console.log('Token:', localStorage.getItem('token'));
```

**Resultado esperado:**
```
User: {"id":X,"nombre":"Usuario Demo","email":"demo@demo.com","rol":"admin",...}
Token: eyJhbGc... (un token JWT largo)
```

---

## 🔍 Verificación del Hash de Contraseña

El hash generado es:
```
$2a$10$Ubb22cEtMlooareVJaMISOGKKx10gUU7aSwVm1KpW7Xf77KojVMCm
```

Este hash fue:
- ✅ Generado con bcryptjs (igual que el backend)
- ✅ Usa 10 salt rounds (igual que el backend)
- ✅ Verificado correctamente con la contraseña 'demo123'

---

## 🐛 Si Algo Sale Mal

### Problema 1: "Credenciales inválidas" después de crear el usuario

**Causa probable:** El hash no coincide o hay un error de tipeo

**Solución:** Verificar que el password_hash en la BD sea exactamente:
```sql
SELECT password_hash FROM usuarios WHERE email = 'demo@demo.com';
-- Debe ser: $2a$10$Ubb22cEtMlooareVJaMISOGKKx10gUU7aSwVm1KpW7Xf77KojVMCm
```

### Problema 2: No puedo conectarme a la BD

**Causa:** No tienes acceso o las credenciales son incorrectas

**Solución:** Contacta a tu proveedor de hosting o verifica las credenciales en tu archivo `.env` del backend en producción.

### Problema 3: El usuario se creó pero no aparece el menú de navegación

**Causa:** El usuario no tiene asignado el rol 'admin' en la tabla `usuario_roles`

**Solución:** Verificar que el rol esté asignado correctamente:
```sql
-- Ver roles del usuario
SELECT
    u.nombre,
    u.email,
    GROUP_CONCAT(r.nombre) as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.id
WHERE u.email = 'demo@demo.com'
GROUP BY u.id, u.nombre, u.email;

-- Si no tiene rol 'admin', asignarlo:
INSERT INTO usuario_roles (usuario_id, rol_id, asignado_en)
SELECT u.id, r.id, NOW()
FROM usuarios u
CROSS JOIN roles r
WHERE u.email = 'demo@demo.com'
  AND r.nombre = 'admin';
```

---

## 📞 Información Técnica

**Archivos generados:**
1. `CREAR_USUARIO_DEMO.sql` - Script SQL completo con verificaciones
2. `backend/generar-password-hash.js` - Script para generar nuevos hashes si necesitas
3. Este archivo de instrucciones

**Hash de la contraseña:**
- Algoritmo: bcryptjs
- Salt rounds: 10
- Password plano: demo123
- Hash: $2a$10$Ubb22cEtMlooareVJaMISOGKKx10gUU7aSwVm1KpW7Xf77KojVMCm

---

## 🎯 Siguiente Paso

**Ejecuta el script SQL en tu base de datos de producción y luego prueba hacer login en:**

👉 https://tecnoandamio.huelemu.com.ar/login

Con las credenciales:
- Email: `demo@demo.com`
- Password: `demo123`

---

**Última actualización:** 2026-01-20
**Estado:** ✅ Script verificado y listo para ejecutar
