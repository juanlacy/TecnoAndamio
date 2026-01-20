# ✅ Solución al Problema de Login - RESUMEN EJECUTIVO

## 🔍 Problema Identificado

**Error SQL:**
```
SQL Error [1054] [42S22]: Unknown column 'password' in 'INSERT INTO'
```

**Causa raíz:**
El script SQL estaba usando nombres de columnas incorrectos. La estructura real de la base de datos es diferente:

| ❌ Nombre Incorrecto | ✅ Nombre Correcto |
|---------------------|-------------------|
| `password`          | `password_hash`   |
| Columna `rol` en tabla `usuarios` | **NO EXISTE** - Los roles se asignan en tabla `usuario_roles` |

---

## 📋 Estructura Real de la Base de Datos

### Tabla `usuarios`
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255),  -- ⚠️ NO se llama 'password'
  google_id VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  created_at DATETIME,
  updated_at DATETIME
  -- ⚠️ NO hay columna 'rol' aquí
);
```

### Tabla `usuario_roles` (M:N)
```sql
CREATE TABLE usuario_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  asignado_en DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (rol_id) REFERENCES roles(id),
  UNIQUE KEY (usuario_id, rol_id)
);
```

### Tabla `roles`
```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL UNIQUE,  -- Ej: 'admin', 'usuario'
  descripcion TEXT,
  permisos JSON,
  activo BOOLEAN DEFAULT true,
  created_at DATETIME,
  updated_at DATETIME
);
```

---

## 🚀 Solución Paso a Paso

### Paso 1: Ver qué roles existen

Primero verifica qué roles tienes en producción:

```sql
SELECT * FROM roles;
```

Si no existe el rol 'admin', créalo:

```sql
INSERT INTO roles (nombre, descripcion, activo, created_at, updated_at)
VALUES ('admin', 'Administrador del sistema', 1, NOW(), NOW());
```

### Paso 2: Crear el usuario demo

```sql
-- Crear usuario (con password_hash, NO password)
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
```

### Paso 3: Asignar rol admin al usuario

```sql
-- Asignar rol 'admin' al usuario demo
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

### Paso 4: Verificar que funcionó

```sql
-- Ver el usuario con sus roles
SELECT
    u.id,
    u.nombre,
    u.email,
    u.activo,
    GROUP_CONCAT(r.nombre) as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.id
WHERE u.email = 'demo@demo.com'
GROUP BY u.id, u.nombre, u.email, u.activo;
```

**Resultado esperado:**
```
+----+-------------+----------------+--------+-------+
| id | nombre      | email          | activo | roles |
+----+-------------+----------------+--------+-------+
|  X | Usuario Demo| demo@demo.com  |      1 | admin |
+----+-------------+----------------+--------+-------+
```

---

## 🎯 Credenciales del Usuario Demo

```
Email:    demo@demo.com
Password: demo123
Roles:    admin
Estado:   Activo
```

**Hash de password (bcryptjs, 10 rounds):**
```
$2a$10$Ubb22cEtMlooareVJaMISOGKKx10gUU7aSwVm1KpW7Xf77KojVMCm
```

---

## 📁 Archivos Actualizados

1. ✅ **CREAR_USUARIO_DEMO.sql** - Script SQL correcto con estructura real de BD
2. ✅ **INSTRUCCIONES_USUARIO_DEMO.md** - Instrucciones detalladas actualizadas
3. ✅ **backend/generar-password-hash.js** - Generador de hashes (listo para usar)
4. ✅ **VERIFICAR_ESTRUCTURA_TABLA.sql** - Script para ver estructura de tablas
5. ✅ Este archivo de resumen

---

## 🔧 Siguientes Pasos

1. **Ejecuta el script completo:**
   ```bash
   mysql -u tu_usuario -p nombre_base_datos < CREAR_USUARIO_DEMO.sql
   ```

2. **O ejecuta los 3 pasos manualmente** (ver arriba)

3. **Prueba login en:** https://tecnoandamio.huelemu.com.ar/login
   - Email: demo@demo.com
   - Password: demo123

4. **Verifica en consola del navegador (F12):**
   ```javascript
   console.log('User:', localStorage.getItem('user'));
   console.log('Token:', localStorage.getItem('token'));
   ```

---

## ⚠️ Puntos Críticos

1. ✅ Usar `password_hash` no `password`
2. ✅ NO intentar insertar columna `rol` en tabla `usuarios`
3. ✅ Asignar roles mediante tabla `usuario_roles`
4. ✅ Verificar que existe el rol 'admin' en tabla `roles` antes de asignar
5. ✅ Usar el hash correcto generado con bcryptjs

---

**Fecha:** 2026-01-20
**Estado:** ✅ Scripts corregidos y listos para ejecutar
**Backend:** ✅ Funcionando
**Frontend:** ✅ Funcionando
**Falta:** Crear usuario demo en la base de datos de producción
