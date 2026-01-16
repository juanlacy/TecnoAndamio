# ⚡ Quick Start - TecnoAndamios

## 🎯 Para Empezar AHORA MISMO

### 1️⃣ Descargar e Inicializar

```bash
# Extraer el proyecto
unzip tecnoandamios-app.zip
cd tecnoandamios-app

# Inicializar Git
git init
git add .
git commit -m "Initial commit: Project structure"

# Crear repositorio en GitHub y push
gh repo create tecnoandamios-app --private --source=. --remote=origin
git push -u origin main
```

### 2️⃣ Instalar Claude Code (Opcional pero Recomendado)

```bash
npm install -g @anthropic-ai/claude-code
claude-code auth
```

### 3️⃣ Setup con Docker (Más Rápido)

```bash
# Iniciar todo
docker-compose up -d

# Ver que todo esté corriendo
docker-compose ps
```

✅ **Backend**: http://localhost:3000  
✅ **Frontend**: http://localhost:4200  
✅ **PHPMyAdmin**: http://localhost:8080

### 4️⃣ Setup Manual (Sin Docker)

#### Backend:
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run migrate
npm run seed
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

### 5️⃣ Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URIs:
   - Redirect: `http://localhost:3000/api/v1/auth/google/callback`
   - Origins: `http://localhost:3000`, `http://localhost:4200`
6. Copiar Client ID y Secret a `backend/.env`

### 6️⃣ Abrir en VS Code

```bash
code .
```

Instalar extensiones recomendadas cuando VS Code lo sugiera.

## 🚀 Desarrollo con Claude Code

```bash
# Abrir Claude Code
claude-code

# Comandos útiles para empezar:
# "Show me the project structure"
# "Create the usuarios Sequelize model"
# "Generate the clientes CRUD controller"
# "Help me implement Google OAuth"
```

## 📚 Documentación Importante

- **[Setup Completo](SETUP.md)** - Guía detallada paso a paso
- **[Guía de Claude Code](CLAUDE_CODE_GUIDE.md)** - Cómo usar Claude Code efectivamente
- **[Arquitectura de BD](database/schema.md)** - Diseño completo de la base de datos
- **[Tareas Pendientes](TASKS.md)** - Checklist completo del proyecto
- **[README Principal](../README.md)** - Información general del proyecto

## 🆘 Problemas Comunes

### Puerto 3000 en uso
```bash
lsof -ti:3000 | xargs kill -9
```

### MySQL no conecta
```bash
docker-compose down
docker-compose up -d mysql
```

### npm install falla
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📋 Próximos Pasos

1. ✅ Setup del proyecto (este paso)
2. 📖 Leer [SETUP.md](SETUP.md) para entender el proyecto
3. 🤖 Familiarizarte con [Claude Code](CLAUDE_CODE_GUIDE.md)
4. 📝 Ver [TASKS.md](TASKS.md) para el roadmap
5. 💻 ¡Empezar a desarrollar!

---

**¡Todo listo! Ahora podés empezar a desarrollar el sistema TecnoAndamios.** 🎉

¿Necesitás ayuda? Revisá la documentación en `/docs` o usá Claude Code.
