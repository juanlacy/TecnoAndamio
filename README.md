# 🏗️ TecnoAndamios - Sistema de Gestión

Sistema web para la gestión integral de alquiler de andamios, reemplazando formularios Google Forms y hojas de cálculo manuales.

## 🎯 Objetivo

Digitalizar y automatizar la gestión de:
- Clientes y Obras
- Estados de Pago (EDP)
- Inventario de Equipos
- Contenedores
- Caja Chica y Gastos
- Usuarios y Permisos

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Base de Datos**: MySQL 8.0
- **Autenticación**: Google OAuth 2.0
- **Validación**: Joi
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17+
- **UI Components**: Angular Material
- **Estado**: RxJS + Services
- **Forms**: Reactive Forms
- **HTTP**: HttpClient con Interceptors

### DevOps
- **Control de versiones**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Contenedores**: Docker + Docker Compose
- **IDE**: VS Code + Claude Code

## 📁 Estructura del Proyecto

```
tecnoandamios-app/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuraciones
│   │   ├── models/      # Modelos Sequelize
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rutas API
│   │   ├── middlewares/ # Middlewares
│   │   ├── services/    # Lógica de negocio
│   │   ├── utils/       # Utilidades
│   │   └── validators/  # Validaciones Joi
│   ├── migrations/      # Migraciones DB
│   ├── seeders/         # Datos iniciales
│   └── tests/           # Tests
│
├── frontend/            # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Servicios core
│   │   │   ├── shared/       # Componentes compartidos
│   │   │   ├── features/     # Módulos funcionales
│   │   │   │   ├── clientes/
│   │   │   │   ├── obras/
│   │   │   │   ├── edp/
│   │   │   │   ├── inventario/
│   │   │   │   ├── contenedores/
│   │   │   │   └── caja-chica/
│   │   │   └── auth/         # Autenticación
│   │   ├── assets/
│   │   └── environments/
│   └── tests/
│
├── docs/                # Documentación
│   ├── database/       # Diagramas y specs DB
│   ├── api/            # Documentación API
│   └── user-guides/    # Guías de usuario
│
├── docker/             # Configuraciones Docker
├── .github/            # GitHub Actions
└── scripts/            # Scripts de utilidad
```

## 🚀 Getting Started

### Prerequisitos
- Node.js 20+
- MySQL 8.0
- Docker & Docker Compose
- Claude Code
- VS Code

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tecnoandamios-app.git
cd tecnoandamios-app

# Backend
cd backend
npm install
cp .env.example .env
# Configurar variables en .env
npm run migrate
npm run seed
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

### Con Docker

```bash
docker-compose up -d
```

## 📚 Documentación

- [Arquitectura de Base de Datos](./docs/database/schema.md)
- [API Documentation](http://localhost:3000/api-docs)
- [Guía de Desarrollo](./docs/development-guide.md)
- **[📊 Control de Migraciones](./MIGRACIONES.md)** ← Importante para despliegue a producción

## 🔧 Desarrollo con Claude Code

```bash
# Iniciar sesión de desarrollo
claude-code

# Ejemplos de comandos útiles:
# "Create the User model with Sequelize"
# "Generate the clients CRUD controller"
# "Add validation for the EDP creation endpoint"
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📋 Roadmap

### Fase 1: Setup y Fundamentos (Semana 1-2)
- [x] Diseño de arquitectura de BD
- [ ] Setup del proyecto (backend + frontend)
- [ ] Configuración Docker
- [ ] Autenticación Google OAuth
- [ ] Sistema de roles y permisos

### Fase 2: Módulos Core (Semana 3-4)
- [ ] CRUD Clientes y Contactos
- [ ] CRUD Obras
- [ ] CRUD Usuarios
- [ ] Catálogo de Equipos

### Fase 3: EDP (Semana 5-6)
- [ ] Gestión de EDP
- [ ] Configuración dinámica de equipos
- [ ] Ciclo de vida de estados
- [ ] Cálculos en UF

### Fase 4: Operaciones (Semana 7-8)
- [ ] Gestión de Contenedores
- [ ] Caja Chica
- [ ] Inventario de Equipos
- [ ] Reportes básicos

### Fase 5: Migración y Producción (Semana 9-10)
- [ ] Script de migración de datos
- [ ] Testing E2E
- [ ] Deployment
- [ ] Capacitación usuarios

## 📄 Licencia

Propietario - TecnoAndamios © 2025

## 👥 Equipo

- **Product Owner**: [Nombre]
- **Tech Lead**: [Nombre]
- **Desarrolladores**: [Nombres]

---

**Construido con ❤️ usando Claude Code**
