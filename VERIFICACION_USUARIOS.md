# ✅ Checklist de Verificación - Módulo de Usuarios

**Fecha:** 2026-01-20
**Aplicación corriendo en:** http://localhost:9200

---

## 🔍 Estado Actual

### ✅ Compilación
- [x] Servidor corriendo sin errores
- [x] Sidebar actualizado con lógica de roles corregida
- [x] Módulos lazy-loaded correctamente:
  - `usuarios-list` (51.70 kB)
  - `usuarios-form` (48.38 kB)
  - `usuarios-detail` (41.09 kB)

---

## 📋 Checklist de Verificación Manual

### 1. **Acceso y Navegación**

#### Login como Administrador
- [ ] Abrir http://localhost:9200/login
- [ ] Iniciar sesión con usuario admin
- [ ] Verificar que el sidebar muestra el enlace "Usuarios" con icono `admin_panel_settings`
- [ ] Click en "Usuarios" navega a `/usuarios`

#### Verificar Permisos
- [ ] El enlace "Usuarios" solo es visible para usuarios con `rol: 'admin'`
- [ ] Si inicio sesión con usuario normal, NO debería ver "Usuarios"

---

### 2. **Lista de Usuarios** (`/usuarios`)

#### Vista General
- [ ] La tabla muestra correctamente con columnas:
  - ID
  - Nombre (con avatar icono)
  - Email (con icono)
  - Rol (chip con color)
  - Estado (chip activo/inactivo)
  - Acciones (Ver, Editar, Eliminar)

#### Funcionalidad
- [ ] Búsqueda funciona para:
  - Nombre
  - Email
  - Rol
- [ ] Click en chip de estado (activo/inactivo) cambia el estado
- [ ] Botón "Nuevo Usuario" navega a `/usuarios/nuevo`
- [ ] Botón "Ver" navega a `/usuarios/:id`
- [ ] Botón "Editar" navega a `/usuarios/:id/editar`
- [ ] Botón "Eliminar" muestra diálogo de confirmación

#### Estados
- [ ] Estado vacío muestra mensaje "No se encontraron usuarios"
- [ ] Loading state muestra spinner
- [ ] Contador "Total de usuarios" correcto

#### Estilos
- [ ] Diseño con gradientes morados (#667eea → #764ba2)
- [ ] Animaciones al hacer hover en filas
- [ ] Responsive en móvil (< 768px)

---

### 3. **Formulario Crear Usuario** (`/usuarios/nuevo`)

#### Estructura del Formulario
- [ ] Sección "Información Personal":
  - Campo Nombre (requerido, min 3 caracteres)
  - Campo Email (requerido, validación email)

- [ ] Sección "Credenciales":
  - Campo Contraseña (requerido, min 6 caracteres)
  - Selector Rol (Administrador / Usuario)

- [ ] Sección "Estado del Usuario":
  - Toggle "Usuario Activo"

#### Validaciones
- [ ] Nombre vacío muestra error "Este campo es requerido"
- [ ] Email inválido muestra error "Ingrese un email válido"
- [ ] Contraseña < 6 caracteres muestra error "Mínimo 6 caracteres"
- [ ] Botón "Crear Usuario" deshabilitado si formulario inválido

#### Funcionalidad
- [ ] Botón "Cancelar" regresa a `/usuarios`
- [ ] Botón "Crear Usuario" guarda y redirige a `/usuarios`
- [ ] Muestra loading state al guardar
- [ ] Muestra mensaje de éxito/error con snackbar

#### Estilos
- [ ] Diseño consistente con formulario de Clientes
- [ ] Campos con fondo #f8f9fa
- [ ] Focus muestra borde azul con sombra
- [ ] Secciones separadas con líneas punteadas

---

### 4. **Formulario Editar Usuario** (`/usuarios/:id/editar`)

#### Diferencias con Crear
- [ ] Título muestra "Editar Usuario"
- [ ] Campos pre-poblados con datos del usuario
- [ ] Sección de contraseña muestra:
  - Info box amarillo: "Deja el campo vacío si no deseas cambiarla"
  - Label: "Nueva Contraseña (opcional)"
  - Placeholder: "Dejar vacío para no cambiar"
  - Campo NO requerido

#### Funcionalidad
- [ ] Cargar datos del usuario al iniciar
- [ ] Si contraseña está vacía, NO se envía al backend
- [ ] Si contraseña tiene valor, se envía al backend
- [ ] Botón "Guardar Cambios" actualiza y redirige

---

### 5. **Vista Detalle de Usuario** (`/usuarios/:id`)

#### Estructura
- [ ] Avatar grande con icono `account_circle`
- [ ] Nombre del usuario como título
- [ ] Badges de:
  - Rol (color warn para admin, primary para usuario)
  - Estado (activo/inactivo)

#### Secciones
- [ ] **Información de Contacto:**
  - Email con icono
  - ID del usuario

- [ ] **Información del Sistema:**
  - Fecha de creación (formateada con DatePipe)
  - Fecha de última actualización

- [ ] **Tarjeta de Permisos:**
  - Si es admin: 6 permisos (usuarios, clientes, obras, equipos, edp)
  - Si es usuario: 4 permisos (visualización, obras, equipos, consulta edp)

#### Funcionalidad
- [ ] Botón "Volver" regresa a `/usuarios`
- [ ] Botón "Editar" navega a `/usuarios/:id/editar`
- [ ] Loading state al cargar

---

## 🎨 Verificación de Diseño Visual

### Colores y Gradientes
- [ ] Título con gradiente: `#667eea → #764ba2`
- [ ] Botones primarios con gradiente morado
- [ ] Cards con border-radius 16-20px
- [ ] Shadows suaves con hover más profundo

### Chips de Rol
- [ ] Admin: color `warn` (rojo/naranja)
- [ ] Usuario: color `primary` (morado/azul)

### Chips de Estado
- [ ] Activo: color `primary` highlighted
- [ ] Inactivo: sin color, no highlighted

### Animaciones
- [ ] fadeIn al cargar páginas
- [ ] slideInRight en headers
- [ ] hover effects en botones (translateY -2px)
- [ ] hover effects en filas de tabla

### Responsive
- [ ] En móvil (< 768px):
  - Header en columna
  - Tabla ajustada
  - Botones full width

---

## 🔧 Verificación Técnica

### Modelos
- [ ] `Usuario` interface tiene campo `rol: string`
- [ ] `CreateUsuarioDto` tiene todos los campos requeridos
- [ ] `UpdateUsuarioDto` tiene campos opcionales (incluyendo `password?`)

### Servicio
- [ ] `UsuariosService.getAll()` funciona
- [ ] `UsuariosService.getById(id)` funciona
- [ ] `UsuariosService.create(dto)` funciona
- [ ] `UsuariosService.update(id, dto)` funciona
- [ ] `UsuariosService.delete(id)` funciona
- [ ] `UsuariosService.toggleActive(id, activo)` funciona

### Rutas
- [ ] `/usuarios` carga UsuariosListComponent
- [ ] `/usuarios/nuevo` carga UsuariosFormComponent
- [ ] `/usuarios/:id` carga UsuariosDetailComponent
- [ ] `/usuarios/:id/editar` carga UsuariosFormComponent

### Guards
- [ ] Todas las rutas están protegidas por `authGuard`
- [ ] Solo usuarios autenticados pueden acceder
- [ ] Solo admins pueden ver el enlace en sidebar

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Usuarios no aparece en el sidebar
**Causa:** La lógica de `canSeeItem()` verificaba `user.roles` (array) pero el modelo actualizado usa `user.rol` (string)

**Solución:** ✅ CORREGIDO - Sidebar ahora verifica ambos:
```typescript
if (user.rol) {
  return item.roles.some(role =>
    role.toLowerCase() === user.rol.toLowerCase()
  );
}
```

### Problema: Contraseña requerida en edición
**Causa:** El FormGroup inicial tenía validador `required` en `password`

**Solución:** ✅ IMPLEMENTADO - Se limpia el validator en modo edición:
```typescript
this.usuarioForm.get('password')?.clearValidators();
this.usuarioForm.get('password')?.updateValueAndValidity();
```

---

## 📊 Resumen de Archivos

### Componentes (9 archivos)
```
frontend/src/app/features/usuarios/
├── usuarios-list/
│   ├── usuarios-list.ts (168 líneas)
│   ├── usuarios-list.html (152 líneas)
│   └── usuarios-list.scss (344 líneas)
├── usuarios-form/
│   ├── usuarios-form.ts (199 líneas)
│   ├── usuarios-form.html (152 líneas)
│   └── usuarios-form.scss (369 líneas)
└── usuarios-detail/
    ├── usuarios-detail.ts (100 líneas)
    ├── usuarios-detail.html (162 líneas)
    └── usuarios-detail.scss (349 líneas)
```

### Servicios y Modelos (2 archivos)
```
frontend/src/app/core/
├── services/usuarios.service.ts (51 líneas)
└── models/usuario.model.ts (50 líneas)
```

**Total:** ~2,096 líneas de código

---

## ✅ Checklist Final

### Para marcar el módulo como completo:
- [ ] Todos los items de "Acceso y Navegación" ✓
- [ ] Todos los items de "Lista de Usuarios" ✓
- [ ] Todos los items de "Formulario Crear" ✓
- [ ] Todos los items de "Formulario Editar" ✓
- [ ] Todos los items de "Vista Detalle" ✓
- [ ] Todos los items de "Diseño Visual" ✓
- [ ] Todos los items de "Verificación Técnica" ✓
- [ ] Sin errores en consola del navegador
- [ ] Sin errores de compilación
- [ ] Funciona en diferentes navegadores

---

## 🚀 Próximos Pasos Sugeridos

Una vez verificado el módulo de Usuarios:

1. **Revisar módulo de Obras** (ya implementado)
2. **Implementar Backend de Usuarios** si aún no existe
3. **Agregar tests unitarios** para componentes
4. **Documentar API endpoints** necesarios

---

**Estado:** ⏳ Pendiente de verificación manual

**Para verificar:** Abrir http://localhost:9200 y seguir este checklist paso a paso.
