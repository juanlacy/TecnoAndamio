# 🪟 Guía de Setup para Windows - TecnoAndamios

## 🚨 Solución a tus Problemas

### Problema 1: `claude-code` no reconocido

**Causa**: Claude Code no está instalado o no está en el PATH de Windows.

**Solución Alternativa (Recomendada):**

En lugar de usar Claude Code CLI, podés usar **Claude en el navegador** (que es donde estás ahora) para desarrollar el proyecto. Es más simple y funciona perfecto.

**¿Cómo?**
1. Abrí VS Code con tu proyecto
2. Cuando necesites ayuda con código, copiá el contexto a este chat
3. Yo te genero el código
4. Copiás y pegás en tu proyecto

**Ventaja**: No necesitás instalar nada adicional y tenés acceso a la misma IA.

---

### Problema 2: `docker-compose` no reconocido

**Causa**: Docker Desktop no está instalado o no está en el PATH.

**Opciones:**

#### Opción A: Instalar Docker Desktop (Recomendado)

1. Descargar Docker Desktop para Windows:
   https://www.docker.com/products/docker-desktop/

2. Instalar y reiniciar la computadora

3. Verificar instalación:
   ```powershell
   docker --version
   docker compose version
   ```

   **Nota**: En versiones nuevas de Docker, el comando es `docker compose` (con espacio) en lugar de `docker-compose` (con guión).

4. Usar el comando correcto:
   ```powershell
   # Nuevo (Docker Desktop reciente)
   docker compose up -d
   
   # O el anterior
   docker-compose up -d
   ```

#### Opción B: Setup Manual (Sin Docker)

Si no querés instalar Docker, podés hacer todo manualmente:

**1. Instalar MySQL**
   - Descargar MySQL 8.0 para Windows: https://dev.mysql.com/downloads/installer/
   - Instalar con MySQL Installer
   - Durante instalación, configurar:
     - Root password: (tu contraseña)
     - Puerto: 3306
     - Habilitar MySQL como servicio de Windows

**2. Crear la base de datos**
   ```sql
   -- Abrir MySQL Workbench o línea de comandos
   CREATE DATABASE tecnoandamios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'tecnoandamios_user'@'localhost' IDENTIFIED BY 'tecnoandamios_pass';
   GRANT ALL PRIVILEGES ON tecnoandamios_db.* TO 'tecnoandamios_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

**3. Configurar backend**
   ```powershell
   cd backend
   copy .env.example .env
   # Editar .env con Notepad o VS Code
   npm install
   npm run migrate
   npm run seed
   npm run dev
   ```

---

## 🛠️ Configuración Completa para Windows

### 1. Prerequisitos

#### A. Node.js (OBLIGATORIO)
```powershell
# Verificar si está instalado
node --version
npm --version

# Si no está instalado:
# Descargar de https://nodejs.org/
# Versión LTS (20.x recomendada)
```

#### B. Git (OBLIGATORIO)
```powershell
# Verificar
git --version

# Si no está instalado:
# Descargar de https://git-scm.com/download/win
```

#### C. VS Code (RECOMENDADO)
```powershell
# Descargar de https://code.visualstudio.com/
```

#### D. MySQL (Opción 1: Manual)
```powershell
# Descargar de https://dev.mysql.com/downloads/installer/
```

#### E. Docker Desktop (Opción 2: Con Docker)
```powershell
# Descargar de https://www.docker.com/products/docker-desktop/
# Requiere WSL 2 habilitado en Windows 10/11
```

---

### 2. Setup del Proyecto

#### Paso 1: Extraer el proyecto

```powershell
# Si tenés 7-Zip
7z x tecnoandamios-app-updated.tar.gz
7z x tecnoandamios-app-updated.tar

# O usar Windows Explorer (clic derecho > Extraer todo)

cd tecnoandamios-app-updated
```

#### Paso 2: Abrir en VS Code

```powershell
code .
```

#### Paso 3: Instalar extensiones de VS Code

Cuando VS Code abra, en la esquina inferior derecha aparecerá:
**"Do you want to install the recommended extensions?"**

→ Click en **"Install All"**

Extensiones clave:
- ESLint
- Prettier
- Angular Language Service
- GitLens

---

### 3. Configurar Backend

#### Opción A: Con Docker (Más Fácil)

```powershell
# Verificar que Docker Desktop esté corriendo

# En la raíz del proyecto
docker compose up -d

# Verificar que todo esté corriendo
docker compose ps

# Ver logs si hay problemas
docker compose logs -f backend
```

**Servicios disponibles:**
- Backend: http://localhost:3000
- MySQL: localhost:3306
- PHPMyAdmin: http://localhost:8080

#### Opción B: Sin Docker (Manual)

```powershell
cd backend

# Copiar configuración
copy .env.example .env

# Editar .env con tus datos de MySQL
notepad .env

# Instalar dependencias
npm install

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

**Backend corriendo en:** http://localhost:3000

---

### 4. Configurar Frontend (Cuando esté listo)

```powershell
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

**Frontend corriendo en:** http://localhost:4200

---

## 🎯 Tu Workflow Recomendado (SIN Claude Code CLI)

### Para Desarrollar:

1. **Abrí VS Code** con el proyecto

2. **Cuando necesites código**, vení a este chat y decime:
   ```
   "Necesito crear el modelo Sequelize para Clientes"
   "Ayudame a hacer el controlador de Obras"
   "Dame el código para la ruta de EDP"
   ```

3. **Yo te genero el código** completo y listo para copiar

4. **Copiás y pegás** en VS Code en el archivo correspondiente

5. **Probás** con:
   ```powershell
   npm run dev  # Para ver que funciona
   npm test     # Para correr tests
   ```

### Ventajas de este enfoque:
- ✅ No necesitás instalar Claude Code CLI
- ✅ Más control sobre el código generado
- ✅ Podés revisar antes de pegar
- ✅ Mismo resultado

---

## 🔄 Comandos Útiles en PowerShell

### Backend

```powershell
# Desarrollo
npm run dev

# Tests
npm test
npm run test:watch

# Linting
npm run lint
npm run lint:fix

# Base de datos
npm run migrate          # Aplicar migraciones
npm run migrate:undo     # Revertir última migración
npm run seed            # Cargar datos de prueba
npm run seed:undo       # Limpiar datos de prueba
```

### Docker (si usás Docker)

```powershell
# Iniciar todo
docker compose up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f
docker compose logs -f backend

# Detener todo
docker compose down

# Reiniciar un servicio
docker compose restart backend

# Entrar a MySQL
docker compose exec mysql mysql -u tecnoandamios_user -p
```

### Git

```powershell
# Ver estado
git status

# Crear rama nueva
git checkout -b feature/nombre-feature

# Commit
git add .
git commit -m "feat: descripción del cambio"

# Push
git push origin feature/nombre-feature
```

---

## 🐛 Troubleshooting Windows

### Error: "npm no es reconocido"

**Solución:**
1. Cerrar y abrir PowerShell (como Administrador)
2. Verificar PATH:
   ```powershell
   $env:Path -split ';' | Select-String node
   ```
3. Si no aparece Node, reinstalar Node.js marcando "Add to PATH"

### Error: "Scripts deshabilitados en este sistema"

**Solución:**
```powershell
# Ejecutar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Puerto 3000 ya está en uso"

**Solución:**
```powershell
# Buscar qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID)
taskkill /PID <número_de_pid> /F

# O usar otro puerto en .env
# PORT=3001
```

### Error: "ENOENT: no such file or directory"

**Solución:**
- Verificar que estés en el directorio correcto
- Usar rutas completas si es necesario
- En Windows usar `\` o `/` en rutas

### MySQL no conecta

**Solución:**
1. Verificar que MySQL esté corriendo:
   ```powershell
   # Servicios de Windows
   services.msc
   # Buscar "MySQL80" y verificar que esté "Running"
   ```

2. Verificar credenciales en `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tecnoandamios_db
   DB_USER=tecnoandamios_user
   DB_PASSWORD=tecnoandamios_pass
   ```

---

## 📝 Próximos Pasos

1. ✅ **Instalar Node.js** (si no está)
2. ✅ **Instalar Git** (si no está)
3. ✅ **Decidir**: ¿Docker o MySQL manual?
4. ✅ **Extraer el proyecto**
5. ✅ **Abrir en VS Code**
6. ✅ **Instalar extensiones**
7. ✅ **Configurar backend**
8. ✅ **Iniciar desarrollo**

---

## 🎯 Tu Primer Comando

```powershell
# Extraer proyecto
cd C:\Proyecto\TecnoAndamios

# Abrir VS Code
code .

# En VS Code, abrir terminal integrada (Ctrl + `)
cd backend
npm install

# Si todo va bien, deberías ver:
# "added XXX packages in XXs"
# Sin warnings de deprecación ✅
```

---

## 💡 Consejo Final

**No necesitás Claude Code CLI.** Este chat es suficiente para desarrollar todo el proyecto. Yo te voy a ir generando cada archivo, modelo, controlador, ruta, etc. a medida que me lo pidas.

**Workflow:**
1. Vos: "Necesito X"
2. Yo: [código completo]
3. Vos: [copiar y pegar en VS Code]
4. ¡Listo!

---

¿Listo para empezar? 🚀
