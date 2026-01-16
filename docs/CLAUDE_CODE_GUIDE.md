# 🤖 Guía de Uso: Claude Code para TecnoAndamios

## ¿Qué es Claude Code?

Claude Code es una herramienta CLI que te permite trabajar con Claude directamente desde tu terminal/IDE para desarrollo asistido por IA.

## 📋 Instalación y Setup

### 1. Instalar Claude Code

```bash
# Instalar globalmente
npm install -g @anthropic-ai/claude-code

# Verificar instalación
claude-code --version
```

### 2. Autenticación

```bash
# Iniciar autenticación (abrirá el navegador)
claude-code auth

# Seguir las instrucciones en el navegador
# Necesitás cuenta de Claude.ai con acceso a la API
```

### 3. Verificar que estás autenticado

```bash
claude-code --help
```

## 🚀 Uso en el Proyecto

### Iniciar sesión de desarrollo

```bash
# Desde la raíz del proyecto
cd tecnoandamios-app
claude-code
```

Esto abrirá una sesión interactiva con Claude donde podés hacer preguntas y solicitar código.

## 💡 Ejemplos de Comandos Útiles

### Para el Backend (Node.js + Express + Sequelize)

```
1. "Create the Sequelize model for usuarios table with the following fields: id, email, nombre, google_id, activo"

2. "Generate the CRUD controller for clientes with validation using Joi"

3. "Create an Express route for /api/v1/clientes with all CRUD operations"

4. "Add a middleware to validate JWT tokens"

5. "Create a Sequelize migration to create the edp table"

6. "Generate a seed file with 10 sample clientes"

7. "Create a service layer for EDP business logic"

8. "Add error handling middleware with proper HTTP status codes"
```

### Para el Frontend (Angular)

```
1. "Generate an Angular service for clientes with CRUD methods"

2. "Create a clientes-list component with a Material table"

3. "Generate a reactive form for creating/editing clientes"

4. "Create an authentication guard for protected routes"

5. "Generate an HTTP interceptor to add JWT token to requests"

6. "Create a shared component for displaying error messages"

7. "Generate the routing module for the clientes feature"
```

### Para la Base de Datos

```
1. "Write a SQL script to create indexes for the edp table"

2. "Generate a Sequelize migration to add a new column to clientes table"

3. "Create a database seed with realistic data for testing"

4. "Write a query to get all EDPs with their related equipos and servicios"
```

## 🎯 Mejores Prácticas con Claude Code

### 1. Sé específico en tus solicitudes

❌ Malo: "Create a user model"
✅ Bueno: "Create a Sequelize model for the usuarios table with fields: id (integer, primary key), email (string, unique), nombre (string), google_id (string, unique), activo (boolean), created_at and updated_at timestamps. Include model associations if needed."

### 2. Proporciona contexto

```
"Based on the database schema in docs/database/schema.md, 
create the Sequelize model for the edp_equipos table with 
proper associations to edp and equipos tables"
```

### 3. Solicita explicaciones

```
"Explain how the EDP state machine should work and then 
create the service methods to handle state transitions"
```

### 4. Iteración incremental

En lugar de pedir todo a la vez:
```
1. "Create the basic Express server setup with middleware"
2. "Add database connection with Sequelize"
3. "Create the authentication routes"
4. "Add error handling"
```

### 5. Pedir tests

```
"Create unit tests for the clientes controller using Jest and Supertest"
```

## 📝 Comandos Comunes del Proyecto

### Backend

```bash
# Desarrollo
npm run dev

# Tests
npm test
npm run test:watch

# Migraciones
npm run migrate
npm run migrate:undo

# Seeds
npm run seed
npm run seed:undo

# Linting
npm run lint
npm run lint:fix
```

### Frontend

```bash
# Desarrollo
npm start

# Build producción
npm run build

# Tests
npm test
npm run test:watch

# Generar componente
ng generate component features/clientes/cliente-list

# Generar servicio
ng generate service core/services/cliente
```

## 🔄 Flujo de Trabajo Recomendado

### 1. **Planificación**
```
"Based on the requirements, create a checklist of tasks 
to implement the clientes CRUD module"
```

### 2. **Backend primero**
```
"Create the database migration for clientes table"
"Create the Sequelize model"
"Create the controller with validation"
"Create the routes"
"Add tests"
```

### 3. **Frontend después**
```
"Create the Angular service"
"Create the list component"
"Create the form component"
"Add routing"
"Add tests"
```

### 4. **Integración**
```
"Review the integration between frontend and backend, 
checking for any missing error handling"
```

## 🛠️ Integración con VS Code

### Extensiones recomendadas

Ya están listadas en `.vscode/extensions.json`:
- ESLint
- Prettier
- Angular Language Service
- GitLens
- Docker
- REST Client

### Configuración

La configuración de VS Code ya está en `.vscode/settings.json` con:
- Formateo automático al guardar
- ESLint fix al guardar
- Configuración TypeScript

## 📚 Recursos Adicionales

### Documentación del Proyecto
- [Arquitectura de BD](../docs/database/schema.md)
- [API Documentation](http://localhost:3000/api-docs)

### Documentación Externa
- [Sequelize](https://sequelize.org/docs/v6/)
- [Express.js](https://expressjs.com/)
- [Angular](https://angular.io/docs)
- [Claude Code](https://docs.anthropic.com/claude/docs/claude-code)

## 💬 Tips de Comunicación con Claude Code

### Formato recomendado de solicitudes:

```
[CONTEXT] Breve descripción del contexto
[TASK] Qué necesitás que haga
[REQUIREMENTS] Requisitos específicos
[FORMAT] Formato de salida esperado
```

**Ejemplo:**
```
[CONTEXT] Estoy trabajando en el módulo de EDP del proyecto TecnoAndamios
[TASK] Necesito crear el controlador para gestionar los estados de EDP
[REQUIREMENTS] 
- Validar transiciones de estado permitidas
- Registrar historial de cambios
- Validar permisos de usuario
- Retornar errores HTTP apropiados
[FORMAT] Controller class con métodos async/await y try-catch
```

## 🚨 Troubleshooting

### Claude Code no responde
```bash
# Reiniciar autenticación
claude-code auth

# Verificar versión
claude-code --version
```

### Errores de contexto
- Claude Code mantiene contexto de la sesión
- Si necesitás empezar de cero, cerrá y abrí una nueva sesión
- Referenciá archivos existentes para mantener consistencia

### Código generado no funciona
- Revisá las dependencias instaladas
- Verificá la configuración en .env
- Ejecutá los tests: `npm test`
- Pedile a Claude que explique el código generado

## 🎓 Ejercicios de Práctica

Probá estos comandos para familiarizarte:

1. "Show me the structure of the backend/src directory and explain each folder's purpose"
2. "Review the package.json and suggest any missing dependencies for a production-ready API"
3. "Create a simple health check endpoint at /api/v1/health"
4. "Generate a middleware to log all API requests"
5. "Create a Sequelize model for the categorias_gasto table"

---

**¡Buena suerte con el desarrollo! 🚀**
