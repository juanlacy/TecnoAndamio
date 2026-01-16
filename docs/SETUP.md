# 🚀 Setup Inicial - TecnoAndamios

## Guía Paso a Paso para Comenzar

### ✅ Prerequisitos

Antes de comenzar, asegurate de tener instalado:

- [x] **Node.js 20+** - [Descargar](https://nodejs.org/)
- [x] **Git** - [Descargar](https://git-scm.com/)
- [x] **VS Code** - [Descargar](https://code.visualstudio.com/)
- [x] **MySQL 8.0** (o usar Docker) - [Descargar](https://dev.mysql.com/downloads/)
- [x] **Docker & Docker Compose** (opcional pero recomendado) - [Descargar](https://www.docker.com/)

### 📥 Paso 1: Clonar el Repositorio

```bash
# Opción A: Si ya creaste el repo en GitHub
git clone https://github.com/tu-usuario/tecnoandamios-app.git
cd tecnoandamios-app

# Opción B: Si estás creando el repo desde cero
mkdir tecnoandamios-app
cd tecnoandamios-app
git init
```

### 🔐 Paso 2: Configurar GitHub

```bash
# Si tenés GitHub CLI instalado:
gh repo create tecnoandamios-app --private --source=. --remote=origin

# O manualmente:
# 1. Ir a https://github.com/new
# 2. Crear repo "tecnoandamios-app" (privado)
# 3. Ejecutar:
git remote add origin https://github.com/tu-usuario/tecnoandamios-app.git
git branch -M main
git add .
git commit -m "Initial commit: Project structure"
git push -u origin main
```

### 🤖 Paso 3: Instalar y Configurar Claude Code

```bash
# Instalar Claude Code globalmente
npm install -g @anthropic-ai/claude-code

# Autenticar (abrirá el navegador)
claude-code auth

# Verificar que funciona
claude-code --version
```

**Nota:** Necesitás tener una cuenta de Claude.ai. Si no tenés acceso a Claude Code, podés trabajar directamente con VS Code y usar este chat para ayuda.

### 💻 Paso 4: Abrir en VS Code

```bash
# Abrir el proyecto en VS Code
code .
```

Cuando VS Code se abra, te va a sugerir instalar las extensiones recomendadas. **Instalá todas**.

### 🐳 Paso 5: Setup con Docker (Opción Recomendada)

**Esta es la forma más fácil de empezar:**

```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps

# Ver logs si hay problemas
docker-compose logs -f
```

Servicios disponibles:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:4200
- **MySQL**: localhost:3306
- **PHPMyAdmin**: http://localhost:8080

### 🔧 Paso 6: Setup Manual (Sin Docker)

Si preferís instalar todo localmente:

#### 6.1 Configurar Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE tecnoandamios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario
CREATE USER 'tecnoandamios_user'@'localhost' IDENTIFIED BY 'tecnoandamios_pass';
GRANT ALL PRIVILEGES ON tecnoandamios_db.* TO 'tecnoandamios_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 6.2 Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar configuración de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
# Importante: configurar las variables de DB y Google OAuth

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba (opcional)
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend debería estar corriendo en http://localhost:3000

#### 6.3 Configurar Frontend

```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Crear archivo de environment (si no existe)
cp src/environments/environment.example.ts src/environments/environment.ts

# Iniciar servidor de desarrollo
npm start
```

El frontend debería estar corriendo en http://localhost:4200

### 🔑 Paso 7: Configurar Google OAuth

Para poder usar login con Google, necesitás crear credenciales:

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Ir a "APIs & Services" > "Credentials"
4. Crear "OAuth 2.0 Client ID"
5. Configurar:
   - **Tipo de aplicación**: Aplicación web
   - **URIs de redireccionamiento autorizados**: 
     - `http://localhost:3000/api/v1/auth/google/callback`
   - **Orígenes de JavaScript autorizados**:
     - `http://localhost:4200`
     - `http://localhost:3000`

6. Copiar el **Client ID** y **Client Secret**
7. Actualizar en `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
   ```

### ✅ Paso 8: Verificar que Todo Funciona

```bash
# Backend health check
curl http://localhost:3000/api/v1/health

# Debería devolver:
# {"status":"ok","timestamp":"..."}

# Abrir el frontend en el navegador
open http://localhost:4200
```

### 🧪 Paso 9: Ejecutar Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 📝 Paso 10: Primer Commit

```bash
# Verificar cambios
git status

# Agregar archivos
git add .

# Commit
git commit -m "chore: Initial project setup"

# Push
git push origin main
```

## 🎯 Próximos Pasos

Ahora que tenés todo configurado, podés empezar a desarrollar:

### Opción A: Con Claude Code

```bash
# Abrir Claude Code en el proyecto
claude-code

# Algunos comandos iniciales para probar:
# "Show me the current project structure"
# "Create the usuarios Sequelize model based on the database schema"
# "Generate the authentication routes for Google OAuth"
```

### Opción B: Seguir el Roadmap

Ver [README.md](../README.md) para el roadmap completo.

**Fase 1 - Setup (Semana 1-2):**
- [x] Estructura del proyecto
- [x] Configuración Docker
- [ ] Implementar autenticación Google OAuth
- [ ] Sistema de roles y permisos
- [ ] Crear modelos Sequelize base

## 🐛 Troubleshooting

### Error: Cannot connect to MySQL

```bash
# Verificar que MySQL está corriendo
# Con Docker:
docker-compose ps

# Sin Docker:
sudo service mysql status

# Verificar credenciales en backend/.env
```

### Error: Port 3000 already in use

```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9

# O usar otro puerto en .env
PORT=3001
```

### Error: npm install falla

```bash
# Limpiar cache
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Frontend no se conecta al backend

Verificar CORS en `backend/.env`:
```
CORS_ORIGIN=http://localhost:4200
```

Y en el frontend `environment.ts`:
```typescript
apiUrl: 'http://localhost:3000/api/v1'
```

## 📚 Recursos Útiles

### Documentación del Proyecto
- [README Principal](../README.md)
- [Arquitectura de BD](database/schema.md)
- [Guía de Claude Code](CLAUDE_CODE_GUIDE.md)

### Documentación Externa
- [Node.js](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/docs/v6/)
- [Angular](https://angular.io/docs)
- [MySQL](https://dev.mysql.com/doc/)

### Comandos Útiles

```bash
# Ver logs del backend
npm run dev

# Ver logs de Docker
docker-compose logs -f backend

# Acceder a la base de datos
mysql -u tecnoandamios_user -p tecnoandamios_db

# O con Docker:
docker-compose exec mysql mysql -u tecnoandamios_user -p

# Reiniciar todo (Docker)
docker-compose down
docker-compose up -d

# Ver todos los contenedores
docker ps -a
```

## 🆘 ¿Necesitás Ayuda?

1. **Revisá este documento** - La mayoría de problemas comunes están cubiertos
2. **Consultá la documentación** en `/docs`
3. **Usá Claude Code** para ayuda específica de código
4. **Revisá los logs** con `docker-compose logs -f`

---

**¡Felicitaciones! Ya tenés el proyecto configurado y listo para desarrollar.** 🎉

Siguiente paso: [Guía de Desarrollo con Claude Code](CLAUDE_CODE_GUIDE.md)
