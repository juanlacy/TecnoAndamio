# 📋 Contexto del Proyecto TecnoAndamio - Sistema de Gestión

**Fecha de última actualización:** 2026-01-20
**Commit actual:** `2ecc065` - feat: Implementar CRUD completo de Usuarios

---

## 🎯 Objetivo del Proyecto

Sistema de gestión integral para empresa de arriendo de andamios, desarrollado con:
- **Backend:** NestJS + TypeScript + PostgreSQL
- **Frontend:** Angular 20 + Material Design + Signals

---

## ✅ Módulos Completados

### 1. **Autenticación y Autorización**
- Login con JWT
- Guard de autenticación
- Servicio AuthService con manejo de tokens
- Sistema de roles (Admin/Usuario)
- Persistencia de sesión en localStorage

### 2. **Clientes (100% Completo)**
**Ubicación:** `frontend/src/app/features/clientes/`

**Archivos:**
- `clientes-list.ts/.html/.scss` - Lista con tabla Material
- `clientes-form.ts/.html/.scss` - Formulario crear/editar
- `clientes-detail.ts/.html/.scss` - Vista detalle

**Características:**
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validación de RUT chileno con formato automático
- ✅ Búsqueda y filtrado en tiempo real
- ✅ Diseño visual mejorado con gradientes y animaciones
- ✅ Responsive design
- ✅ Gestión de activo/inactivo
- ✅ Diálogos de confirmación para eliminación

**Modelo Cliente:**
```typescript
interface Cliente {
  id: number;
  rut: string;
  razon_social: string;
  nombre_fantasia?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### 3. **Usuarios (100% Completo)** ⭐ RECIÉN COMPLETADO
**Ubicación:** `frontend/src/app/features/usuarios/`

**Archivos:**
- `usuarios-list/usuarios-list.ts/.html/.scss` - Lista con tabla Material
- `usuarios-form/usuarios-form.ts/.html/.scss` - Formulario crear/editar
- `usuarios-detail/usuarios-detail.ts/.html/.scss` - Vista detalle

**Características:**
- ✅ CRUD completo exclusivo para administradores
- ✅ Gestión de roles (admin/usuario)
- ✅ Activar/desactivar usuarios con toggle
- ✅ Cambio de contraseña opcional en edición
- ✅ Validación de email y contraseña
- ✅ Vista de permisos según rol
- ✅ Búsqueda por nombre, email o rol
- ✅ Diseño visual mejorado consistente con Clientes

**Modelo Usuario:**
```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string; // 'admin' | 'usuario'
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  activo: boolean;
}

interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password?: string;  // Opcional en edición
  rol?: string;
  activo?: boolean;
}
```

**Servicio:** `frontend/src/app/core/services/usuarios.service.ts`

---

## 🏗️ Arquitectura del Frontend

### Estructura de Carpetas
```
frontend/src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   ├── cliente.model.ts
│   │   └── usuario.model.ts
│   ├── services/
│   │   ├── api.service.ts (Base HTTP service)
│   │   ├── auth.service.ts
│   │   ├── clientes.service.ts
│   │   └── usuarios.service.ts
│   └── utils/
│       └── rut.validator.ts
├── features/
│   ├── auth/
│   │   └── login/
│   ├── clientes/
│   │   ├── clientes-list
│   │   ├── clientes-form
│   │   └── clientes-detail
│   ├── dashboard/
│   └── usuarios/
│       ├── usuarios-list/
│       ├── usuarios-form/
│       └── usuarios-detail/
└── shared/
    ├── components/
    │   ├── layout/
    │   ├── sidebar/
    │   ├── header/
    │   ├── loading/
    │   └── confirm-dialog/
    └── utils/
```

### Servicios Principales

**1. ApiService** (`core/services/api.service.ts`)
- Servicio base para peticiones HTTP
- Manejo centralizado de errores
- URL base configurada en environment

**2. AuthService** (`core/services/auth.service.ts`)
- Login/Logout
- Gestión de tokens JWT
- getCurrentUser()
- Persistencia en localStorage

**3. ClientesService** (`core/services/clientes.service.ts`)
```typescript
- getAll(): Observable<Cliente[]>
- getById(id: number): Observable<Cliente>
- create(cliente: CreateClienteDto): Observable<Cliente>
- update(id: number, cliente: UpdateClienteDto): Observable<Cliente>
- delete(id: number): Observable<void>
```

**4. UsuariosService** (`core/services/usuarios.service.ts`)
```typescript
- getAll(): Observable<Usuario[]>
- getById(id: number): Observable<Usuario>
- create(usuario: CreateUsuarioDto): Observable<Usuario>
- update(id: number, usuario: UpdateUsuarioDto): Observable<Usuario>
- delete(id: number): Observable<void>
- toggleActive(id: number, activo: boolean): Observable<Usuario>
- changePassword(id: number, newPassword: string): Observable<void>
```

### Componentes Compartidos

**1. Layout** (`shared/components/layout/`)
- Estructura principal de la aplicación
- Incluye Sidebar y Header
- Outlet para rutas hijas

**2. Sidebar** (`shared/components/sidebar/`)
- Navegación principal
- Control de permisos por rol
- Menu items configurables

**3. ConfirmDialog** (`shared/components/confirm-dialog/`)
- Diálogo reutilizable para confirmaciones
- Configurable (título, mensaje, botones, colores)

**4. Loading** (`shared/components/loading/`)
- Spinner de carga reutilizable
- Mensaje personalizable

### Rutas Configuradas

```typescript
// app.routes.ts
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },

      // Clientes
      { path: 'clientes', component: ClientesList },
      { path: 'clientes/nuevo', component: ClientesForm },
      { path: 'clientes/editar/:id', component: ClientesForm },
      { path: 'clientes/ver/:id', component: ClientesDetail },

      // Usuarios (solo admin)
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/nuevo', component: UsuariosFormComponent },
      { path: 'usuarios/:id', component: UsuariosDetailComponent },
      { path: 'usuarios/:id/editar', component: UsuariosFormComponent }
    ]
  }
];
```

---

## 🎨 Diseño Visual

### Paleta de Colores Principal
```scss
// Gradiente principal
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Colores secundarios
$primary: #667eea;
$accent: #764ba2;
$success: #4caf50;
$warning: #ff9800;
$danger: #f44336;

// Grises
$gray-50: #f8f9fa;
$gray-100: #e9ecef;
$gray-200: #dee2e6;
```

### Características de Diseño
- **Animaciones:** fadeIn, slideInRight, hover effects
- **Border radius:** 12px-20px para cards y botones
- **Shadows:** box-shadow con gradiente para profundidad
- **Responsive:** Breakpoints en 768px, 1024px
- **Icons:** Material Icons
- **Typography:** Montserrat/Roboto

---

## 📦 Dependencias Importantes

```json
{
  "@angular/core": "^20.0.0",
  "@angular/material": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@angular/router": "^20.0.0",
  "rxjs": "^7.8.0",
  "typescript": "^5.7.0"
}
```

---

## 🚀 Próximos Pasos Sugeridos

### 1. **Módulo de Obras** (PRIORIDAD ALTA)
**Ubicación sugerida:** `frontend/src/app/features/obras/`

**Modelo sugerido:**
```typescript
interface Obra {
  id: number;
  codigo: string;                // Código único de obra
  nombre: string;
  descripcion?: string;
  cliente_id: number;            // FK a Clientes
  cliente?: Cliente;
  direccion: string;
  ciudad: string;
  fecha_inicio: string;
  fecha_termino_estimada?: string;
  estado: 'planificacion' | 'en_curso' | 'suspendida' | 'finalizada';
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}
```

**Características a implementar:**
- CRUD completo
- Relación con Clientes (selector en formulario)
- Estados de obra con chips de colores
- Filtrado por cliente y estado
- Calendario de fechas
- Vista detalle con información completa

### 2. **Módulo de Equipos** (PRIORIDAD ALTA)
**Ubicación sugerida:** `frontend/src/app/features/equipos/`

**Modelo sugerido:**
```typescript
interface Equipo {
  id: number;
  codigo: string;               // Código único de equipo
  tipo: string;                 // Tipo de andamio/equipo
  descripcion: string;
  precio_arriendo_diario: number;
  cantidad_disponible: number;
  cantidad_total: number;
  estado: 'disponible' | 'arrendado' | 'mantencion' | 'baja';
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}
```

**Características a implementar:**
- CRUD completo
- Control de stock (disponible/total)
- Gestión de precios
- Estados con indicadores visuales
- Filtrado por tipo y estado

### 3. **Módulo de Estados de Pago (EDP)** (PRIORIDAD MEDIA)
**Ubicación sugerida:** `frontend/src/app/features/edp/`

**Modelo sugerido:**
```typescript
interface EstadoPago {
  id: number;
  numero: string;               // Número de EDP
  obra_id: number;              // FK a Obras
  obra?: Obra;
  periodo_inicio: string;
  periodo_fin: string;
  monto_subtotal: number;
  monto_iva: number;
  monto_total: number;
  estado: 'borrador' | 'enviado' | 'aprobado' | 'pagado' | 'rechazado';
  fecha_emision?: string;
  fecha_pago?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

interface DetalleEDP {
  id: number;
  edp_id: number;
  equipo_id: number;
  equipo?: Equipo;
  cantidad: number;
  dias: number;
  precio_unitario: number;
  subtotal: number;
}
```

**Características a implementar:**
- CRUD completo con detalle de líneas
- Cálculo automático de totales
- Estados con workflow
- Generación de PDF
- Filtrado por obra, fecha, estado

### 4. **Dashboard Mejorado** (PRIORIDAD MEDIA)
**Mejoras sugeridas:**
- Tarjetas con estadísticas (total clientes, obras activas, etc.)
- Gráficos con Chart.js o ngx-charts
- Obras recientes
- Equipos más arrendados
- EDPs pendientes
- Alertas y notificaciones

### 5. **Funcionalidades Adicionales**
- **Reportes:** Módulo de reportes con filtros y exportación
- **Configuración:** Módulo de configuración del sistema
- **Notificaciones:** Sistema de notificaciones en tiempo real
- **Historial:** Registro de cambios (auditoría)
- **Backup:** Sistema de respaldo de datos

---

## 🔧 Comandos Útiles

```bash
# Iniciar desarrollo frontend
cd frontend
npm start

# Build de producción
npm run build

# Linting
npm run lint

# Tests
npm test

# Generar componente
npx ng generate component features/[modulo]/[nombre]
```

---

## ⚠️ Notas Importantes

1. **Convenciones de Nombres:**
   - Interfaces: PascalCase (ej: `Usuario`, `CreateUsuarioDto`)
   - Archivos: kebab-case (ej: `usuarios-list.ts`)
   - Clases: PascalCase (ej: `UsuariosListComponent`)
   - Variables/funciones: camelCase (ej: `loadUsuarios()`)

2. **Patrones Establecidos:**
   - Standalone components en todos los módulos
   - Signals para estado reactivo
   - Inject() en lugar de constructor DI
   - Material Design para UI
   - Reactive Forms para formularios

3. **Estructura de Archivos:**
   - Cada feature tiene su carpeta
   - Separación: `.ts`, `.html`, `.scss`
   - Componentes standalone e independientes

4. **Git:**
   - Commits descriptivos con Co-Authored-By
   - Branch: `main`
   - Convención: `feat:`, `fix:`, `docs:`, etc.

5. **Estilos:**
   - Variables globales en `styles.scss`
   - Estilos específicos en componente
   - Responsive: mobile-first approach

---

## 📝 Estado del Backend

**PENDIENTE:** El backend en NestJS debe implementarse con:
- Controladores para cada módulo
- DTOs de validación
- Servicios con lógica de negocio
- TypeORM para PostgreSQL
- Autenticación JWT
- Guards de autorización

**Base de datos sugerida:**
```
Tablas principales:
- usuarios
- clientes
- obras
- equipos
- estados_pago
- detalle_estados_pago
- arriendos (relación obras-equipos)
```

---

## 🎓 Lecciones Aprendidas

1. **Imports correctos:**
   - `Loading` (no `LoadingComponent`)
   - `ConfirmDialog` (no `ConfirmDialogComponent`)
   - Usar `DatePipe` de `@angular/common` para fechas

2. **Modelo de Usuario:**
   - Incluir propiedad `rol: string` además de `roles?: Rol[]`
   - DTOs separados para Create y Update

3. **Validaciones:**
   - Usar validators de Angular Reactive Forms
   - Custom validators para casos especiales (RUT)

4. **Performance:**
   - Lazy loading de módulos
   - Signals para reactividad eficiente
   - OnPush change detection (considerar)

---

## 📞 Contacto y Soporte

Para continuar el desarrollo:
1. Revisar este documento
2. Verificar último commit: `git log -1`
3. Ejecutar `npm start` en frontend
4. Continuar con "Próximos Pasos Sugeridos"

**Estado actual:** ✅ Frontend base completado con Clientes y Usuarios funcionando.

---

**¡El proyecto está listo para continuar con el módulo de Obras!** 🚀
