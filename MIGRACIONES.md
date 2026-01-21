# 📊 Control de Migraciones de Base de Datos

Este documento registra **TODAS** las migraciones que deben ejecutarse en **PRODUCCIÓN** cuando se despliegue el sistema.

---

## ⚠️ IMPORTANTE PARA PRODUCCIÓN

Cuando despliegues a producción, debes ejecutar:

```bash
cd backend
npm run migrate
```

Esto ejecutará automáticamente **SOLO** las migraciones que aún no se han ejecutado en esa base de datos.

---

## 📋 Migraciones Pendientes para PRODUCCIÓN

### 🆕 Nuevas Migraciones (Sesión 21-Ene-2026)

#### 1. **20260121145909-add-missing-columns-to-obras.cjs**
**Fecha:** 21 de Enero 2026
**Módulo:** Obras
**Descripción:** Agrega campos faltantes a la tabla `obras`

**Cambios:**
- ✅ Agrega columna `codigo` (VARCHAR 50, UNIQUE, NOT NULL)
  - Genera códigos automáticos para registros existentes: `OBR-00001`, `OBR-00002`, etc.
- ✅ Agrega columna `descripcion` (TEXT, nullable)
- ✅ Agrega columna `ciudad` (VARCHAR 100, nullable)
- ✅ Agrega columna `fecha_inicio` (DATE, NOT NULL)
  - Asigna fecha actual a registros existentes
- ✅ Agrega columna `fecha_termino_estimada` (DATE, nullable)
- ✅ Agrega columna `estado` (ENUM: 'planificacion', 'en_curso', 'suspendida', 'finalizada', default 'planificacion')

**Impacto:**
- ✅ SEGURA - Incluye manejo de datos existentes
- ✅ NO rompe datos existentes
- ✅ Agrega valores por defecto para registros previos

**Reversión:** `npm run migrate:undo` (si es necesario)

---

#### 2. **20260121151848-add-activo-to-equipos-and-componentes.cjs**
**Fecha:** 21 de Enero 2026
**Módulo:** Equipos
**Descripción:** Agrega campo `activo` a equipos y componentes

**Cambios:**
- ✅ Agrega columna `activo` a tabla `equipos` (BOOLEAN, NOT NULL, default true)
- ✅ Agrega columna `activo` a tabla `componentes_equipo` (BOOLEAN, NOT NULL, default true)

**Impacto:**
- ✅ SEGURA - Valor por defecto `true` para todos los registros
- ✅ NO rompe datos existentes
- ✅ Permite soft-delete en el futuro

**Reversión:** `npm run migrate:undo` (si es necesario)

---

## 📝 Migraciones Base (Ya ejecutadas previamente)

Las siguientes migraciones son las que crean la estructura inicial de la base de datos:

1. `20260116000001-create-usuarios.cjs` - Tabla usuarios
2. `20260116000002-create-roles.cjs` - Tabla roles
3. `20260116000003-create-usuario-roles.cjs` - Relación usuarios-roles
4. `20260116000004-create-clientes.cjs` - Tabla clientes
5. `20260116000005-create-contactos.cjs` - Tabla contactos
6. `20260116000006-create-obras.cjs` - Tabla obras (estructura base)
7. `20260116000007-create-categorias-equipos.cjs` - Tabla categorías de equipos
8. `20260116000008-create-equipos.cjs` - Tabla equipos
9. `20260116000009-create-componentes-equipo.cjs` - Tabla componentes
10. `20260116000010-create-tipos-servicio.cjs` - Tabla tipos de servicio
11. `20260116000011-create-edp.cjs` - Tabla EDPs (Estados de Pago)
12. `20260116000012-create-edp-equipos.cjs` - Relación EDPs-Equipos
13. `20260116000013-create-edp-servicios.cjs` - Relación EDPs-Servicios
14. `20260116000014-create-edp-estados-historico.cjs` - Histórico de estados
15. `20260119000001-add-activo-to-roles.cjs` - Campo activo en roles

---

## 🔍 Verificar Estado de Migraciones

Para verificar qué migraciones están ejecutadas en un ambiente:

```bash
cd backend
npx sequelize-cli db:migrate:status
```

Esto mostrará:
- `up` - Migración ejecutada ✅
- `down` - Migración pendiente ⏳

---

## 🚀 Proceso de Despliegue a Producción

### Paso 1: Backup de Base de Datos
```bash
# SIEMPRE hacer backup antes de migrar
mysqldump -u usuario -p tecnoandamios_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Paso 2: Verificar Migraciones Pendientes
```bash
cd backend
NODE_ENV=production npx sequelize-cli db:migrate:status
```

### Paso 3: Ejecutar Migraciones
```bash
NODE_ENV=production npm run migrate
```

### Paso 4: Verificar Resultado
```bash
NODE_ENV=production npx sequelize-cli db:migrate:status
```

---

## ⚠️ Rollback (Si algo sale mal)

Para revertir la última migración:
```bash
NODE_ENV=production npm run migrate:undo
```

Para revertir TODAS las migraciones (¡CUIDADO!):
```bash
NODE_ENV=production npx sequelize-cli db:migrate:undo:all
```

---

## 📌 Notas Importantes

1. **SIEMPRE** haz backup antes de migrar en producción
2. Las migraciones se ejecutan en orden cronológico automáticamente
3. Sequelize registra qué migraciones ya se ejecutaron en la tabla `SequelizeMeta`
4. NO ejecutes migraciones manualmente con SQL - usa `npm run migrate`
5. Si una migración falla, Sequelize NO la marca como ejecutada
6. Puedes ejecutar `npm run migrate` múltiples veces - solo ejecuta las pendientes

---

## 📊 Historial de Cambios

| Fecha | Migración | Módulo | Estado Prod |
|-------|-----------|--------|-------------|
| 21-Ene-2026 | add-missing-columns-to-obras | Obras | ⏳ Pendiente |
| 21-Ene-2026 | add-activo-to-equipos-and-componentes | Equipos | ⏳ Pendiente |

---

**Última actualización:** 21 de Enero de 2026
**Ambiente de Desarrollo:** ✅ Actualizado
**Ambiente de Producción:** ⏳ Pendiente de aplicar migraciones
