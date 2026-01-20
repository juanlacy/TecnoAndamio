# ✅ Solución a Problemas de Roles y Módulo de Usuarios

## 📋 Problemas Identificados

### 1. ❌ Módulo "Usuarios" no aparece en el menú
**Causa:** El frontend esperaba `user.roles` como array de objetos `{id, nombre}` pero el backend devuelve array de strings `['admin']`.

### 2. ❌ Error 500 al cargar módulo de Obras
**Causa probable:** El mismo problema de incompatibilidad en el formato de roles estaba causando errores en otros módulos.

---

## 🔧 Soluciones Aplicadas

### 1. Actualizado el Modelo de Usuario

**Archivo:** `frontend/src/app/core/models/usuario.model.ts`

**Antes:**
```typescript
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;  // Un solo rol como string
  roles?: Rol[];  // Array de objetos {id, nombre}
  activo: boolean;
}
```

**Después:**
```typescript
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: string;  // Deprecado, para compatibilidad
  roles?: string[];  // Array de strings: ['admin', 'usuario']
  activo: boolean;
}
```

---

### 2. Actualizado AuthService

**Archivo:** `frontend/src/app/core/services/auth.service.ts`

**Método `hasRole()` actualizado:**
```typescript
hasRole(roleName: string): boolean {
  const user = this.currentUser();
  if (!user) return false;

  // Soporte para roles como array de strings (backend actual)
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some(role =>
      role.toLowerCase() === roleName.toLowerCase()
    );
  }

  // Soporte legacy para rol como string
  if (user.rol) {
    return user.rol.toLowerCase() === roleName.toLowerCase();
  }

  return false;
}
```

---

### 3. Actualizado Sidebar

**Archivo:** `frontend/src/app/shared/components/sidebar/sidebar.ts`

**Método `canSeeItem()` actualizado:**
```typescript
canSeeItem(item: MenuItem): boolean {
  if (!item.roles || item.roles.length === 0) {
    return true;
  }

  const user = this.authService.getCurrentUser();
  if (!user) {
    return false;
  }

  // Check roles array (backend devuelve roles como array de strings)
  if (user.roles && Array.isArray(user.roles)) {
    return item.roles.some(menuRole =>
      user.roles!.some(userRole =>
        userRole.toLowerCase() === menuRole.toLowerCase()
      )
    );
  }

  // Fallback: check rol string (legacy support)
  if (user.rol) {
    return item.roles.some(role =>
      role.toLowerCase() === user.rol!.toLowerCase()
    );
  }

  return false;
}
```

---

### 4. Actualizado RoleGuard

**Archivo:** `frontend/src/app/core/guards/role.guard.ts`

```typescript
// roles es ahora un array de strings: ['admin', 'usuario']
const hasRole = user.roles.some(role =>
  allowedRoles.some(allowed => allowed.toLowerCase() === role.toLowerCase())
);
```

---

### 5. Actualizado Componentes de Usuarios

**Archivos:**
- `usuarios-list.ts` - Filtro de búsqueda soporta ambos formatos
- `usuarios-detail.html` - Muestra rol desde `user.roles[0]` o `user.rol`
- `navbar.html` - Muestra rol como string no como objeto

---

## 📦 Estructura de Roles - Backend vs Frontend

### Backend (authService.js) devuelve:

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 1,
      "email": "demo@demo.com",
      "nombre": "Usuario Demo",
      "roles": ["admin"],  // ← Array de strings
      "activo": true
    },
    "token": "eyJhbGc..."
  }
}
```

### Frontend (usuario.model.ts) espera:

```typescript
interface Usuario {
  id: number;
  email: string;
  nombre: string;
  roles?: string[];  // ← Array de strings (ACTUALIZADO)
  activo: boolean;
}
```

**✅ Ahora son compatibles!**

---

## 🚀 Deploy a Producción

### Opción 1: Deploy Manual

```bash
# 1. Compilar el frontend (YA HECHO)
cd frontend
npm run build

# 2. Copiar archivos al servidor
scp -r dist/frontend/browser/* usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/

# 3. Reiniciar nginx (si es necesario)
ssh usuario@tecnoandamio.huelemu.com.ar
sudo systemctl reload nginx
```

### Opción 2: Deploy con rsync

```bash
rsync -avz --delete \
  frontend/dist/frontend/browser/ \
  usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/
```

### Opción 3: Deploy Automático (si tienes script)

```bash
./deploy.sh frontend
```

---

## ✅ Verificación Post-Deploy

### 1. Limpiar caché del navegador

**En el navegador:**
1. Presiona `Ctrl + Shift + Delete` (Windows/Linux) o `Cmd + Shift + Delete` (Mac)
2. Marca "Archivos e imágenes en caché"
3. Haz clic en "Borrar datos"

**O con el navegador abierto:**
1. Presiona `Ctrl + F5` (hard refresh)

### 2. Hacer login nuevamente

1. Ve a: https://tecnoandamio.huelemu.com.ar/login
2. Ingresa:
   - Email: `demo@demo.com`
   - Password: `demo123`

### 3. Verificar en consola del navegador (F12)

```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Roles:', user.roles);  // Debe mostrar: ['admin']
```

**Resultado esperado:**
```javascript
{
  id: 1,
  nombre: "Usuario Demo",
  email: "demo@demo.com",
  roles: ["admin"],  // ← Array de strings
  activo: true
}
```

### 4. Verificar menú lateral

**Deberías ver estos items:**
- ✅ Dashboard
- ✅ Clientes
- ✅ Obras
- ✅ Equipos
- ✅ EDPs
- ✅ **Usuarios** ← Ahora debería aparecer!

### 5. Verificar módulo de Obras

1. Haz clic en "Obras"
2. **NO debería mostrar error 500**
3. Debería cargar la lista de obras correctamente

---

## 🐛 Si Aún Hay Problemas

### Problema 1: Todavía no veo el módulo "Usuarios"

**Solución:**
```javascript
// En consola del navegador (F12):
localStorage.clear();
location.reload();
// Luego vuelve a hacer login
```

### Problema 2: Sigue apareciendo error 500 en Obras

**Diagnóstico:**

1. **Ver logs del backend:**
   ```bash
   # En producción
   pm2 logs backend --lines 50
   ```

2. **Cambiar a modo development temporalmente:**
   ```bash
   # Editar .env del backend
   NODE_ENV=development

   # Reiniciar
   pm2 restart backend
   ```

3. **Intentar cargar obras** y ver el error completo

4. **Volver a producción:**
   ```bash
   NODE_ENV=production
   pm2 restart backend
   ```

### Problema 3: El caché no se limpia

**Solución:**

1. Agregar versionado al index.html (si tienes acceso al servidor):
   ```html
   <base href="/?v=20260120">
   ```

2. O usar incógnito/privado para probar

---

## 📊 Resumen de Cambios

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `usuario.model.ts` | `roles` ahora es `string[]` | ✅ |
| `auth.service.ts` | `hasRole()` soporta array de strings | ✅ |
| `sidebar.ts` | `canSeeItem()` soporta array de strings | ✅ |
| `role.guard.ts` | Guard actualizado para strings | ✅ |
| `usuarios-list.ts` | Filtro soporta ambos formatos | ✅ |
| `usuarios-detail.html` | Muestra rol correctamente | ✅ |
| `navbar.html` | Muestra rol como string | ✅ |

---

## 🎯 Siguiente Paso

1. **Deploy a producción** (copiar archivos de `frontend/dist/frontend/browser/`)
2. **Limpiar caché del navegador**
3. **Hacer login** con `demo@demo.com` / `demo123`
4. **Verificar que:**
   - ✅ Aparece módulo "Usuarios" en el menú
   - ✅ Módulo "Obras" carga sin error 500
   - ✅ Todos los módulos funcionan correctamente

---

**Fecha:** 2026-01-20
**Estado:** ✅ Frontend compilado exitosamente
**Listo para:** Deploy a producción
