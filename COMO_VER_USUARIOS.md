# 🚀 Guía Rápida: Cómo Ver el Módulo de Usuarios

## ⚠️ PROBLEMA DETECTADO

**Tu localStorage está vacío:**
```javascript
localStorage.getItem('user') // null
```

**Esto significa:** NO estás logueado → No puedes ver ningún módulo.

---

## ✅ SOLUCIÓN: Hacer Login

### Opción 1: Login Normal (Recomendado)

1. **Ir a la página de login:**
   ```
   http://localhost:9200/login
   ```

2. **Usar credenciales de administrador:**
   - **Email:** `admin@tecnoandamios.cl` (o el que tengas configurado)
   - **Password:** Tu contraseña de admin

3. **Después del login exitoso:**
   - Serás redirigido al dashboard
   - El sidebar mostrará "Usuarios" al final
   - Podrás hacer click en "Usuarios"

---

### Opción 2: Login Manual con Console (Para Pruebas)

Si el backend no está disponible, puedes simular un login para ver la UI:

1. **Abre DevTools (F12) → Console**

2. **Ejecuta este código:**

```javascript
// Crear usuario admin de prueba
const fakeUser = {
  id: 1,
  nombre: "Admin Demo",
  email: "admin@demo.com",
  rol: "admin",  // ← IMPORTANTE: debe ser 'admin'
  activo: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Crear token fake
const fakeToken = "fake-jwt-token-for-testing";

// Guardar en localStorage
localStorage.setItem('user', JSON.stringify(fakeUser));
localStorage.setItem('token', fakeToken);

// Recargar página
location.reload();
```

3. **Después de recargar:**
   - Deberías ver "Usuarios" en el sidebar
   - Click en "Usuarios" para ver el módulo

---

## 🔍 Verificar que Funcionó

Después de hacer login, ejecuta en la consola:

```javascript
// 1. Verificar usuario
console.log('Usuario:', JSON.parse(localStorage.getItem('user')));
// Debe mostrar: { id: 1, nombre: "...", rol: "admin", ... }

// 2. Verificar que el enlace existe
console.log('Enlace Usuarios:', document.querySelector('[routerLink="/usuarios"]'));
// Debe mostrar: <a ...>Usuarios</a>

// 3. Verificar rol
const user = JSON.parse(localStorage.getItem('user'));
console.log('Es admin?', user?.rol === 'admin');
// Debe mostrar: true
```

---

## 📋 Checklist de Acceso

### Pre-requisitos
- [ ] Frontend corriendo en `http://localhost:9200` ✅ (Ya está)
- [ ] Backend corriendo en `http://localhost:9000` (Verificar)
- [ ] Base de datos con usuario admin

### Pasos
1. [ ] Ir a `http://localhost:9200/login`
2. [ ] Hacer login con usuario **admin**
3. [ ] Verificar que aparece el sidebar
4. [ ] Buscar enlace "Usuarios" (último del menú)
5. [ ] Click en "Usuarios"
6. [ ] Debería cargar `/usuarios`

---

## 🎯 Qué Verás Después del Login como Admin

### Sidebar (Menú Izquierdo)
```
📊 Dashboard
👥 Clientes
🏗️ Obras
📦 Equipos
📄 Estados de Pago
👤 Usuarios  ← ESTE SOLO APARECE PARA ADMIN
```

### Al hacer click en "Usuarios"
1. **Lista de Usuarios** (`/usuarios`)
   - Tabla con todos los usuarios
   - Buscador en tiempo real
   - Botones: Nuevo, Ver, Editar, Eliminar
   - Toggle activo/inactivo

2. **Crear Usuario** (`/usuarios/nuevo`)
   - Formulario completo
   - Campos: Nombre, Email, Contraseña, Rol, Activo
   - Validaciones en tiempo real

3. **Ver Usuario** (`/usuarios/:id`)
   - Detalle completo
   - Información de contacto
   - Permisos según rol
   - Fechas de creación/actualización

4. **Editar Usuario** (`/usuarios/:id/editar`)
   - Mismo formulario que crear
   - Datos pre-cargados
   - Contraseña opcional

---

## ⚠️ Si NO Ves "Usuarios" en el Sidebar

### Causas Posibles:

1. **No estás logueado como admin**
   ```javascript
   // Verifica en consola:
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('Rol:', user?.rol);
   // Debe ser: "admin" (minúscula)
   ```

2. **El usuario tiene rol diferente**
   - Si el rol es `"usuario"` o `"user"` → NO verás "Usuarios"
   - Solo `rol: "admin"` puede ver este módulo

3. **Problema de permisos**
   - Cierra sesión: `localStorage.clear()`
   - Vuelve a hacer login
   - Refresca (F5)

---

## 🔧 Troubleshooting

### Error: "Cannot read property 'rol' of null"
**Solución:** No estás logueado
```javascript
localStorage.clear();
// Ir a /login y volver a iniciar sesión
```

### Error: "Usuarios" no aparece
**Solución:** Verifica el rol
```javascript
const user = JSON.parse(localStorage.getItem('user'));
if (user.rol !== 'admin') {
  console.error('❌ Tu usuario NO es admin');
  console.log('Tu rol:', user.rol);
} else {
  console.log('✅ Eres admin');
}
```

### Error: Página en blanco en /usuarios
**Posibles causas:**
1. Backend no está corriendo
2. Endpoint `GET /usuarios` no existe
3. Token JWT inválido
4. CORS bloqueado

**Verifica en Network tab (F12):**
- Debe haber petición a `http://localhost:9000/api/usuarios`
- Si falla con 404: el endpoint no existe
- Si falla con 401: problema de autenticación
- Si falla con 500: error en el backend

---

## 📱 Vista Previa del Módulo

### Lista de Usuarios
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Buscar usuarios...                    [+ Nuevo]  │
├─────────────────────────────────────────────────────┤
│ ID  │ Nombre       │ Email          │ Rol    │ ... │
├─────┼──────────────┼────────────────┼────────┼─────┤
│ #1  │ Admin Demo   │ admin@...      │ 🔴Admin│ ✅  │
│ #2  │ Juan Pérez   │ juan@...       │ 🔵User │ ✅  │
│ #3  │ María López  │ maria@...      │ 🔵User │ ❌  │
└─────────────────────────────────────────────────────┘
```

### Formulario Crear
```
┌─────────────────────────────────────┐
│ ← Nuevo Usuario                     │
├─────────────────────────────────────┤
│ 📝 Información Personal             │
│   Nombre:    [________________]     │
│   Email:     [________________]     │
│                                     │
│ 🔒 Credenciales                     │
│   Contraseña:[________________]     │
│   Rol:       [▼ Administrador  ]    │
│                                     │
│ ⚙️ Estado                            │
│   Usuario Activo: [✓]              │
│                                     │
│ [Cancelar]  [Crear Usuario]        │
└─────────────────────────────────────┘
```

---

## ✅ RESUMEN

**Para ver el módulo de Usuarios:**

1. ✅ Frontend está corriendo
2. ⚠️ **Necesitas hacer LOGIN como ADMIN**
3. ✅ El código está completo
4. ✅ Las rutas están configuradas
5. ✅ El sidebar está actualizado

**El único problema es que NO estás logueado.**

---

## 🚀 ACCIÓN INMEDIATA

**Ve a:** http://localhost:9200/login

**Haz login con usuario admin**

**Luego busca "Usuarios" en el sidebar**

---

¿Necesitas ayuda para:
- [ ] Crear un usuario admin en la base de datos?
- [ ] Verificar que el backend esté corriendo?
- [ ] Ver las credenciales de admin?
