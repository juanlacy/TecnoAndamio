# 🎨 Frontend Angular - Kickoff Session

## 📊 Estado Actual del Proyecto

### ✅ Backend Completado (100%)
- **Puerto**: 9000
- **Base URL Local**: http://localhost:9000/api/v1
- **Base URL Producción**: https://tecnoandamios.huelemu.com.ar/api/v1
- **Health Check**: /health
- **Autenticación**: JWT Bearer Token

### 🗄️ Base de Datos
- **Local**: tecnoandamios_db@localhost:3306
- **Producción**: tecnoandamios@localhost (aaPanel)
- **14 tablas** creadas con migraciones
- **Seeders** ejecutados (roles, admin, categorías, tipos de servicio)

### 👤 Usuario Admin Demo
- **Email**: admin@tecnoandamios.com
- **Password**: admin123

---

## 🌐 API Endpoints Disponibles

### Autenticación
```
POST   /api/v1/auth/login       - Login con email/password
POST   /api/v1/auth/register    - Registro de usuario
POST   /api/v1/auth/refresh     - Renovar JWT token
GET    /api/v1/auth/me          - Obtener usuario actual
POST   /api/v1/auth/logout      - Logout
```

### Dashboard
```
GET    /api/v1/dashboard/stats  - Estadísticas generales
```

### Usuarios (requiere rol Admin)
```
GET    /api/v1/usuarios?search=&page=1&limit=10  - Listar con paginación
GET    /api/v1/usuarios/:id                      - Detalle de usuario
POST   /api/v1/usuarios                          - Crear usuario
PUT    /api/v1/usuarios/:id                      - Actualizar usuario
DELETE /api/v1/usuarios/:id                      - Eliminar usuario
```

### Roles
```
GET    /api/v1/roles            - Listar roles (Admin, Operador, Supervisor)
```

### Clientes
```
GET    /api/v1/clientes?search=&rut=&page=1&limit=10  - Lista con paginación
GET    /api/v1/clientes/:id                           - Detalle de cliente
POST   /api/v1/clientes                               - Crear cliente
PUT    /api/v1/clientes/:id                           - Actualizar cliente
DELETE /api/v1/clientes/:id                           - Eliminar cliente
GET    /api/v1/clientes/:id/contactos                 - Listar contactos
GET    /api/v1/clientes/:id/obras                     - Listar obras del cliente
```

### Contactos
```
POST   /api/v1/clientes/:clienteId/contactos   - Crear contacto
PUT    /api/v1/contactos/:id                   - Actualizar contacto
DELETE /api/v1/contactos/:id                   - Eliminar contacto
```

### Obras
```
GET    /api/v1/obras?cliente_id=&activa=&page=1&limit=10  - Lista con paginación
GET    /api/v1/obras/:id                                  - Detalle de obra
POST   /api/v1/obras                                      - Crear obra
PUT    /api/v1/obras/:id                                  - Actualizar obra
DELETE /api/v1/obras/:id                                  - Eliminar obra
```

### Categorías de Equipos
```
GET    /api/v1/categorias-equipos              - Listar categorías
POST   /api/v1/categorias-equipos              - Crear (Admin)
PUT    /api/v1/categorias-equipos/:id          - Actualizar (Admin)
DELETE /api/v1/categorias-equipos/:id          - Eliminar (Admin)
```

### Equipos
```
GET    /api/v1/equipos?categoria_id=&disponible=&page=1&limit=10  - Lista
GET    /api/v1/equipos/:id                                        - Detalle
POST   /api/v1/equipos                                            - Crear
PUT    /api/v1/equipos/:id                                        - Actualizar
DELETE /api/v1/equipos/:id                                        - Eliminar
GET    /api/v1/equipos/:id/componentes                            - Listar componentes
```

### Componentes de Equipo
```
POST   /api/v1/equipos/:equipoId/componentes   - Crear componente
PUT    /api/v1/componentes/:id                 - Actualizar componente
DELETE /api/v1/componentes/:id                 - Eliminar componente
```

### Tipos de Servicio
```
GET    /api/v1/tipos-servicio                  - Listar tipos (Armado, Desarmado, Flete)
```

### EDP - Estados de Pago
```
GET    /api/v1/edp?estado=&cliente_id=&obra_id=&page=1&limit=10  - Lista con filtros
GET    /api/v1/edp/:id                                           - Detalle completo
POST   /api/v1/edp                                               - Crear EDP
PUT    /api/v1/edp/:id                                           - Actualizar EDP
DELETE /api/v1/edp/:id                                           - Eliminar (solo Borrador)
PATCH  /api/v1/edp/:id/estado                                    - Cambiar estado
GET    /api/v1/edp/:id/historial                                 - Ver historial de estados
```

**Estados EDP**: Borrador → Abierto → Cerrado → Validado → Facturado → Cobrado

---

## 🎯 Alcance del Frontend MVP

### Módulos a Implementar (Orden de prioridad)

1. **Autenticación** ⭐ PRIORITARIO
   - Pantalla de login
   - Manejo de JWT token
   - Redirección a dashboard
   - Logout

2. **Dashboard Básico**
   - Tarjetas con estadísticas (clientes, obras, EDPs activos)
   - Layout con sidebar y navbar
   - Menú de navegación

3. **Gestión de Usuarios** (Admin)
   - Lista con tabla Material (paginación, búsqueda)
   - Formulario crear/editar
   - Asignación de roles

4. **Maestro de Clientes**
   - Lista con tabla Material
   - Formulario crear/editar con validación de RUT
   - Detalle con tabs: Información, Contactos, Obras
   - Gestión de contactos (agregar/eliminar)

5. **Maestro de Obras**
   - Lista con tabla Material
   - Formulario crear/editar
   - Selector de cliente (dropdown)

6. **Catálogo de Equipos**
   - Lista con tabla Material
   - Formulario crear/editar
   - Gestión de componentes (tabla anidada)

7. **EDP Simplificado**
   - Lista con tabla Material (filtros por estado)
   - Formulario crear/editar
   - Selector de cliente → obras (cascada)
   - Selector de equipos (multi-select)
   - Cambio de estado con validación

---

## 🏗️ Arquitectura Frontend Propuesta

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios singleton, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts    # Proteger rutas autenticadas
│   │   │   │   └── role.guard.ts    # Proteger rutas por rol
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts    # Agregar JWT a headers
│   │   │   │   └── error.interceptor.ts   # Manejar errores HTTP
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts        # Login, logout, token
│   │   │   │   ├── api.service.ts         # Wrapper HttpClient
│   │   │   │   └── storage.service.ts     # localStorage wrapper
│   │   │   └── models/
│   │   │       ├── usuario.model.ts
│   │   │       ├── cliente.model.ts
│   │   │       ├── obra.model.ts
│   │   │       ├── equipo.model.ts
│   │   │       └── edp.model.ts
│   │   │
│   │   ├── shared/                  # Componentes reutilizables
│   │   │   ├── components/
│   │   │   │   ├── navbar/          # Barra superior
│   │   │   │   ├── sidebar/         # Menú lateral
│   │   │   │   ├── table/           # Tabla reutilizable con paginación
│   │   │   │   ├── modal/           # Modal genérico
│   │   │   │   └── loading/         # Spinner de carga
│   │   │   └── pipes/
│   │   │       ├── rut-format.pipe.ts     # Formatear RUT (12.345.678-9)
│   │   │       └── date-format.pipe.ts    # Formatear fechas
│   │   │
│   │   ├── features/                # Módulos funcionales
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   │
│   │   │   ├── usuarios/
│   │   │   │   ├── lista-usuarios/
│   │   │   │   ├── form-usuario/
│   │   │   │   ├── usuario.service.ts
│   │   │   │   └── usuarios.module.ts
│   │   │   │
│   │   │   ├── clientes/
│   │   │   │   ├── lista-clientes/
│   │   │   │   ├── form-cliente/
│   │   │   │   ├── detalle-cliente/
│   │   │   │   ├── cliente.service.ts
│   │   │   │   └── clientes.module.ts
│   │   │   │
│   │   │   ├── obras/
│   │   │   │   ├── lista-obras/
│   │   │   │   ├── form-obra/
│   │   │   │   ├── obra.service.ts
│   │   │   │   └── obras.module.ts
│   │   │   │
│   │   │   ├── equipos/
│   │   │   │   ├── lista-equipos/
│   │   │   │   ├── form-equipo/
│   │   │   │   ├── equipo.service.ts
│   │   │   │   └── equipos.module.ts
│   │   │   │
│   │   │   └── edp/
│   │   │       ├── lista-edp/
│   │   │       ├── form-edp/
│   │   │       ├── detalle-edp/
│   │   │       ├── edp.service.ts
│   │   │       └── edp.module.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts           # apiUrl: http://localhost:9000/api/v1
│   │   └── environment.prod.ts      # apiUrl: /api/v1
│   └── styles.scss
│
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Plan de Implementación Frontend

### Fase 1: Setup Inicial (1-2 horas)
1. Crear proyecto Angular 17+ con routing y SCSS
2. Instalar Angular Material
3. Configurar environments (development y production)
4. Crear estructura de carpetas (core, shared, features)

### Fase 2: Core Module (2-3 horas)
1. AuthService (login, logout, isAuthenticated, getToken)
2. ApiService (wrapper HttpClient con base URL)
3. StorageService (setToken, getToken, removeToken)
4. AuthInterceptor (agregar JWT a headers)
5. ErrorInterceptor (capturar errores 401, 403, 500)
6. AuthGuard (proteger rutas)
7. RoleGuard (proteger por rol)
8. Modelos TypeScript (interfaces)

### Fase 3: Shared Module (1-2 horas)
1. Navbar component (logo, menú, usuario, logout)
2. Sidebar component (menú lateral con navegación)
3. Loading component (spinner global)
4. Pipes: rut-format, date-format

### Fase 4: Auth Module (1-2 horas)
1. Login component (formulario reactive)
2. Integración con AuthService
3. Redirección a dashboard
4. Manejo de errores (credenciales inválidas)

### Fase 5: Dashboard Module (1 hora)
1. Tarjetas con estadísticas
2. Consumir /dashboard/stats
3. Layout responsive

### Fase 6: Módulos CRUD (10-12 horas)
1. **Usuarios** (2 horas)
   - Lista con mat-table (paginación, búsqueda)
   - Form crear/editar (modal o página)
   - Asignación de roles (checkboxes)

2. **Clientes** (3 horas)
   - Lista con mat-table
   - Form con validación de RUT
   - Detalle con tabs (Información, Contactos, Obras)
   - Gestión de contactos

3. **Obras** (2 horas)
   - Lista con mat-table
   - Form crear/editar
   - Selector de cliente

4. **Equipos** (2 horas)
   - Lista con mat-table
   - Form crear/editar
   - Gestión de componentes (tabla anidada)

5. **EDP** (3 horas)
   - Lista con filtros por estado
   - Form con selector cliente → obras (cascada)
   - Cambio de estado (botones con validación)

### Fase 7: Integración y Pulido (2-3 horas)
1. Mensajes de éxito/error (snackbar)
2. Confirmaciones de eliminación (dialog)
3. Estados de carga (spinners)
4. Responsive design básico
5. Navegación breadcrumb

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **Formularios**: Reactive Forms
- **HTTP**: HttpClient con Interceptors
- **Routing**: Angular Router con Guards
- **Estilos**: SCSS + Angular Material Theme
- **Validaciones**: Validadores custom (RUT)

---

## 📝 Comandos Iniciales

```bash
# Crear proyecto Angular
cd C:\Proyecto\TecnoAndamio
ng new frontend --routing --style=scss --skip-git

cd frontend

# Instalar Angular Material
ng add @angular/material
# Seleccionar: Indigo/Pink theme, typography: Yes, animations: Yes

# Configurar environment
# Editar: src/environments/environment.ts
# apiUrl: 'http://localhost:9000/api/v1'

# Iniciar servidor de desarrollo
ng serve
# Acceder: http://localhost:4200
```

---

## 🔗 URLs de Desarrollo

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:9000
- **API**: http://localhost:9000/api/v1
- **Health Check**: http://localhost:9000/health

---

## 📊 Ejemplo de Request/Response

### Login
**Request**:
```json
POST http://localhost:9000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@tecnoandamios.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Admin",
      "email": "admin@tecnoandamios.com",
      "roles": [
        {
          "id": 1,
          "nombre": "Admin"
        }
      ]
    }
  }
}
```

### Dashboard Stats
**Request**:
```
GET http://localhost:9000/api/v1/dashboard/stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_clientes": 15,
    "total_obras": 23,
    "edps_activos": 8,
    "edps_por_estado": {
      "Borrador": 2,
      "Abierto": 3,
      "Cerrado": 3
    }
  }
}
```

---

## ✅ Checklist Primera Sesión Frontend

- [ ] Crear proyecto Angular con routing y SCSS
- [ ] Instalar Angular Material
- [ ] Configurar environments (apiUrl)
- [ ] Crear estructura core/shared/features
- [ ] Implementar AuthService
- [ ] Implementar AuthInterceptor
- [ ] Implementar AuthGuard
- [ ] Crear Login component
- [ ] Probar login con backend
- [ ] Crear Dashboard básico
- [ ] Crear Navbar y Sidebar
- [ ] Configurar routing con guards

---

## 🎉 Resultado Esperado

Al final de la primera sesión:
- ✅ Login funcionando con JWT
- ✅ Dashboard básico con estadísticas
- ✅ Layout con navbar y sidebar
- ✅ Routing protegido con guards
- ✅ Manejo de errores con interceptor
- ✅ Token guardado en localStorage
- ✅ Logout funcionando

---

**Preparado por**: Claude Sonnet 4.5
**Fecha**: 2026-01-19
**Backend Status**: ✅ 100% Funcional
