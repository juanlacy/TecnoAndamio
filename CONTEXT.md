# TecnoAndamios - Contexto del Proyecto

## 🎯 Objetivo del Proyecto
Sistema web para digitalizar la gestión de alquiler de andamios, reemplazando Google Forms y hojas de cálculo manuales por una aplicación web centralizada.

## 📊 Situación Actual
La empresa usa:
- Google Forms para capturar información
- Google Sheets para gestión manual
- Pentaho para enviar datos a bases de datos
- 9 formularios diferentes con datos fragmentados
- +2,900 registros de caja chica
- +550 registros de contenedores
- 92 Estados de Pago (EDP) - documento maestro

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+ con ES Modules
- **Framework**: Express.js 4.19.2
- **ORM**: Sequelize 6.37.3
- **Base de Datos**: MySQL 8.0
- **Autenticación**: Google OAuth 2.0 + JWT
- **Validación**: Joi
- **Logger**: Winston
- **Date Library**: dayjs (NO moment - deprecado)

### Frontend
- **Framework**: Angular 17+
- **UI**: Angular Material
- **Estado**: RxJS + Services
- **Forms**: Reactive Forms

### DevOps
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Control de versiones**: Git + GitHub

## 📁 Estructura de Directorios

```
tecnoandamios-app/
├── backend/
│   ├── src/
│   │   ├── config/        # DB, auth, env
│   │   ├── models/        # Modelos Sequelize
│   │   ├── controllers/   # Lógica de controladores
│   │   ├── routes/        # Rutas API
│   │   ├── middlewares/   # Auth, validación, errores
│   │   ├── services/      # Lógica de negocio
│   │   ├── utils/         # Helpers
│   │   └── validators/    # Schemas Joi
│   ├── migrations/        # Migraciones DB
│   ├── seeders/          # Datos de prueba
│   └── tests/            # Tests Jest
│
├── frontend/
│   └── src/app/
│       ├── core/         # Servicios, guards, interceptors
│       ├── shared/       # Componentes compartidos
│       ├── features/     # Módulos funcionales
│       │   ├── clientes/
│       │   ├── obras/
│       │   ├── edp/
│       │   ├── inventario/
│       │   ├── contenedores/
│       │   └── caja-chica/
│       └── auth/         # Autenticación
│
└── docs/
    └── database/         # Schema y documentación DB
```

## 🗄️ Arquitectura de Base de Datos

### Entidades Principales (32 tablas)

**1. Usuarios y Seguridad**
- `usuarios` - Información de usuarios
- `roles` - Roles del sistema (Admin, Operador, Supervisor)
- `usuario_roles` - Relación M:N usuarios-roles

**2. Maestros de Datos**
- `clientes` - Empresas cliente
- `contactos` - Contactos de clientes (1:N con clientes)
- `obras` - Obras asociadas a clientes
- `vehiculos` - Vehículos de la empresa (matrículas)

**3. Catálogo de Equipos**
- `categorias_equipos` - Tipos de equipos (Andamio Colgante, Cremallera, etc)
- `equipos` - Catálogo de equipos disponibles
- `componentes_equipo` - Componentes de cada equipo (motores, barandas, pisos)
- `inventario_equipos` - Instancias físicas de equipos (nuevo, control de stock)

**4. Estados de Pago (EDP) - CORE BUSINESS**
- `edp` - Documento maestro de alquiler
- `edp_equipos` - Equipos incluidos en EDP (M:N con configuración JSON)
- `edp_servicios` - Servicios asociados (armado, desarmado, flete)
- `edp_estados_historico` - Ciclo de vida: Borrador → Abierto → Cerrado → Validado → Facturado → Cobrado
- `edp_cargos_adicionales` - Cargos extras
- `edp_valores_uf` - Valores UF por mes
- `tipos_servicio` - Catálogo de servicios

**5. Gestión de Contenedores**
- `contenedores` - Registro de contenedores
- `contenedor_movimientos` - Movimientos (entrega, retiro, cambio)

**6. Gestión Financiera**
- `caja_chica` - Movimientos de caja (ingreso/egreso/comprobante)
- `categorias_gasto` - 30+ categorías parametrizables
- `gastos_generales` - Gastos generales de la empresa

### Relaciones Clave

```
clientes (1) --> (N) obras
clientes (1) --> (N) contactos
clientes (1) --> (N) edp
obras (1) --> (N) edp

edp (1) --> (N) edp_equipos
edp_equipos (1) --> (N) edp_servicios
equipos (1) --> (N) edp_equipos
equipos (1) --> (N) componentes_equipo
equipos (1) --> (N) inventario_equipos

usuarios (M) --> (N) roles (through usuario_roles)
```

## 🎯 Flujo de Negocio Principal

```
1. Cliente → 2. Obra → 3. EDP (con equipos y servicios)
                              ↓
                        4. Valores UF aplicados
                              ↓
                        5. Cargos adicionales (opcional)
                              ↓
                        6. Cierre de EDP
                              ↓
                        7. Validación → 8. Facturación → 9. Cobro
```

Paralelo: Gestión de Contenedores y Caja Chica

## 📝 Módulos a Desarrollar (Prioridad)

### Fase 1 - Fundamentos (Semana 1-2)
1. Setup del proyecto ✅
2. Autenticación Google OAuth
3. Sistema de roles y permisos
4. Modelos Sequelize base

### Fase 2 - Maestros (Semana 3-4)
5. CRUD Clientes y Contactos
6. CRUD Obras
7. CRUD Usuarios
8. Catálogo de Equipos
9. ABM Vehículos

### Fase 3 - EDP (Semana 5-6)
10. Gestión de EDP (core business)
11. Configuración dinámica de equipos
12. Máquina de estados
13. Cálculos en UF
14. Generación de PDFs

### Fase 4 - Operaciones (Semana 7-8)
15. Gestión de Contenedores
16. Caja Chica (formulario condicional)
17. Inventario de Equipos
18. Reportes básicos

## 🔑 Puntos Clave de Implementación

### Backend
1. **ES Modules**: Usar `import/export`, NO `require`
2. **dayjs**: Para fechas, NO moment (deprecado)
3. **Validación**: Joi para schemas, express-validator para requests
4. **Error Handling**: Middleware centralizado
5. **Logging**: Winston para logs estructurados
6. **Sequelize**: Modelos con asociaciones, migrations, seeders

### Frontend
1. **Módulos lazy-loaded**: Por feature
2. **Reactive Forms**: Para formularios complejos
3. **Material Design**: Componentes de Angular Material
4. **Guards**: Para proteger rutas
5. **Interceptors**: JWT automático en headers

### Seguridad
1. **Helmet**: Headers de seguridad
2. **Rate Limiting**: Protección DDoS
3. **JWT**: Tokens con refresh
4. **CORS**: Configurado apropiadamente
5. **Input Validation**: En todos los endpoints

## 🚨 Casos Especiales

### 1. EDP - Formulario Dinámico
- Según tipo de equipo, campos cambian
- 102 columnas originales → normalizado en 5 tablas
- Configuración de componentes en JSON

### 2. Caja Chica - Lógica Condicional
- Tipo movimiento (Ingreso/Egreso/Comprobante) cambia campos requeridos
- Categorías específicas requieren vehículo (combustible, mantenimiento)
- Relación opcional con EDP

### 3. Contenedores - Movimientos
- Entrega, Retiro, Cambio
- Documentación adjunta (guías, vales, comprobantes)
- Cálculos por toneladas y KDM

### 4. Inventario
- Control de estado por unidad física (Disponible/Alquilado/Mantenimiento)
- Alertas de mantenimiento programado

## 📊 Métricas de Éxito
- Tiempo de respuesta API < 200ms
- Uptime > 99%
- Reducción 70% en tiempo de tareas manuales
- 0 pérdida de datos
- Tests coverage > 80%

## 🔄 Convenciones de Código

### Nombres
- **Tablas**: snake_case (ej: `edp_equipos`)
- **Modelos**: PascalCase (ej: `EdpEquipo`)
- **Variables**: camelCase (ej: `clienteId`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `MAX_FILE_SIZE`)

### Rutas API
```
GET    /api/v1/clientes          # Lista
GET    /api/v1/clientes/:id      # Detalle
POST   /api/v1/clientes          # Crear
PUT    /api/v1/clientes/:id      # Actualizar
DELETE /api/v1/clientes/:id      # Eliminar
```

### Respuestas API
```json
// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Cliente creado exitosamente"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "RUT inválido",
    "details": [...]
  }
}
```

## 🎓 Próximos Pasos Inmediatos

1. **Crear estructura de directorios en backend/src/**
2. **Configurar Sequelize** (config/database.js)
3. **Crear modelo Usuario** (autenticación)
4. **Implementar Google OAuth**
5. **Crear primeros modelos**: Cliente, Contacto, Obra
6. **Crear controladores y rutas básicas**
7. **Setup de tests con Jest**

---

**Este documento es tu fuente de verdad. Todo el desarrollo debe ser consistente con esta arquitectura.**
