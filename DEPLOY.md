# 🚀 Guía de Deploy - TecnoAndamios Backend

## 📋 Pre-requisitos

- aaPanel instalado en portal.huelemu.com.ar
- Node.js 18+ instalado en el servidor
- MySQL 8+ configurado en aaPanel
- PM2 para gestión de procesos Node.js
- Nginx configurado como reverse proxy

---

## 🗄️ Paso 1: Configurar Base de Datos en aaPanel

1. **Acceder a aaPanel** → `portal.huelemu.com.ar`
2. **Database** → La base de datos ya fue creada con:
   - Nombre: `tecnoandamios`
   - Usuario: `tecnoandamios`
   - Contraseña: `BEjTScLppLwsrML4`

---

## 📁 Paso 2: Subir el código al servidor

### Opción A: Git (Recomendada)

```bash
# En el servidor, crear directorio del proyecto
cd /www/wwwroot
mkdir tecnoandamios.huelemu.com.ar
cd tecnoandamios.huelemu.com.ar

# Clonar repositorio (ajustar URL)
git clone <URL_DEL_REPO> .

# Ir a carpeta backend
cd backend

# Instalar dependencias
npm install --production
```

### Opción B: FTP/SFTP

1. Comprimir carpeta `backend` en local
2. Subir vía FTP a `/www/wwwroot/tecnoandamios.huelemu.com.ar/`
3. Descomprimir en el servidor
4. SSH al servidor y ejecutar `npm install --production`

---

## ⚙️ Paso 3: Configurar variables de entorno

```bash
cd /www/wwwroot/tecnoandamios.huelemu.com.ar/backend

# Copiar archivo de producción
cp .env.production .env

# Editar con nano/vi y cambiar el JWT_SECRET
nano .env
```

**IMPORTANTE**: Generar JWT_SECRET seguro:
```bash
# En el servidor, ejecutar:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiar el resultado y pegarlo en .env como JWT_SECRET
```

Archivo `.env` final debe tener:
```env
NODE_ENV=production
PORT=9000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tecnoandamios
DB_USER=tecnoandamios
DB_PASSWORD=BEjTScLppLwsrML4
JWT_SECRET=<valor-generado-con-crypto>
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://tecnoandamios.huelemu.com.ar
LOG_LEVEL=info
```

---

## 🗃️ Paso 4: Ejecutar Migraciones

```bash
cd /www/wwwroot/tecnoandamios.huelemu.com.ar/backend

# Ejecutar migraciones
npm run migrate

# Ejecutar seeders (datos iniciales)
npm run seed
```

Esto creará:
- ✅ 14 tablas en la base de datos
- ✅ Roles: Admin, Operador, Supervisor
- ✅ Usuario admin: admin@tecnoandamios.com / admin123
- ✅ Categorías de equipos
- ✅ Tipos de servicio

---

## 🚀 Paso 5: Configurar PM2

```bash
# Instalar PM2 globalmente (si no está instalado)
npm install -g pm2

cd /www/wwwroot/tecnoandamios.huelemu.com.ar/backend

# Iniciar aplicación con PM2
pm2 start src/server.js --name tecnoandamios-backend --watch

# Guardar configuración
pm2 save

# Configurar para auto-inicio
pm2 startup
# Ejecutar el comando que PM2 te muestre
```

**Comandos útiles PM2:**
```bash
pm2 status                  # Ver estado
pm2 logs tecnoandamios-backend  # Ver logs
pm2 restart tecnoandamios-backend  # Reiniciar
pm2 stop tecnoandamios-backend     # Detener
pm2 delete tecnoandamios-backend   # Eliminar proceso
```

---

## 🌐 Paso 6: Configurar Nginx en aaPanel

1. **Acceder a aaPanel** → Website → Add Site
2. **Crear sitio:**
   - Domain: `tecnoandamios.huelemu.com.ar`
   - PHP Version: No usar PHP (backend es Node.js)

3. **Configurar Reverse Proxy:**
   - Website → tecnoandamios.huelemu.com.ar → Config
   - Agregar configuración Nginx:

```nginx
server {
    listen 80;
    server_name tecnoandamios.huelemu.com.ar;

    # Logs
    access_log /www/wwwlogs/tecnoandamios-access.log;
    error_log /www/wwwlogs/tecnoandamios-error.log;

    # Reverse Proxy al backend Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Frontend (agregar cuando esté listo)
    location / {
        root /www/wwwroot/tecnoandamios.huelemu.com.ar/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Guardar y recargar Nginx**

---

## 🔒 Paso 7: Configurar SSL (HTTPS)

1. **aaPanel** → Website → tecnoandamios.huelemu.com.ar → SSL
2. **Let's Encrypt** → Solicitar certificado SSL gratuito
3. **Activar Force HTTPS**

Nginx actualizará automáticamente la configuración a:
```nginx
server {
    listen 443 ssl http2;
    server_name tecnoandamios.huelemu.com.ar;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # ... resto de configuración ...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name tecnoandamios.huelemu.com.ar;
    return 301 https://$server_name$request_uri;
}
```

---

## ✅ Paso 8: Verificar funcionamiento

```bash
# 1. Verificar que PM2 esté corriendo
pm2 status

# 2. Verificar logs
pm2 logs tecnoandamios-backend --lines 50

# 3. Probar health check
curl http://localhost:9000/health

# 4. Probar desde internet
curl https://tecnoandamios.huelemu.com.ar/health
```

**Endpoints de prueba:**
```bash
# Health check
GET https://tecnoandamios.huelemu.com.ar/health

# Login
POST https://tecnoandamios.huelemu.com.ar/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@tecnoandamios.com",
  "password": "admin123"
}
```

---

## 🔥 Firewall y Seguridad

Asegurarse que en aaPanel:
1. **Security** → Firewall
2. Permitir puertos:
   - `80` (HTTP)
   - `443` (HTTPS)
   - `22` (SSH para administración)
3. **NO** exponer el puerto `9000` (solo Nginx debe acceder)

---

## 📊 Monitoreo

### Ver logs en tiempo real:
```bash
pm2 logs tecnoandamios-backend
```

### Logs de Nginx:
```bash
tail -f /www/wwwlogs/tecnoandamios-access.log
tail -f /www/wwwlogs/tecnoandamios-error.log
```

### Logs de la aplicación:
```bash
tail -f /www/wwwroot/tecnoandamios.huelemu.com.ar/backend/logs/combined.log
tail -f /www/wwwroot/tecnoandamios.huelemu.com.ar/backend/logs/error.log
```

---

## 🔄 Actualizar código (CD)

```bash
cd /www/wwwroot/tecnoandamios.huelemu.com.ar/backend

# Pull cambios
git pull origin main

# Instalar nuevas dependencias si hay
npm install --production

# Ejecutar migraciones nuevas si hay
npm run migrate

# Reiniciar PM2
pm2 restart tecnoandamios-backend
```

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Ver logs de PM2
pm2 logs tecnoandamios-backend --err

# Verificar .env
cat .env

# Verificar puerto 9000 libre
lsof -i :9000
```

### Error de conexión a DB
```bash
# Probar conexión MySQL
mysql -u tecnoandamios -p
# Ingresar password: BEjTScLppLwsrML4

# Verificar que la DB existe
SHOW DATABASES;
USE tecnoandamios;
SHOW TABLES;
```

### Nginx 502 Bad Gateway
```bash
# Verificar que PM2 está corriendo
pm2 status

# Verificar puerto 9000
curl http://localhost:9000/health

# Ver logs de Nginx
tail -f /www/wwwlogs/tecnoandamios-error.log
```

---

## 📝 Checklist Final

- [ ] Base de datos creada en aaPanel
- [ ] Código subido al servidor
- [ ] Variables de entorno configuradas (.env)
- [ ] JWT_SECRET generado con crypto
- [ ] Migraciones ejecutadas
- [ ] Seeders ejecutados
- [ ] PM2 configurado y corriendo
- [ ] Nginx configurado con reverse proxy
- [ ] SSL/HTTPS configurado
- [ ] Health check funcionando
- [ ] Login funcionando con usuario admin
- [ ] Firewall configurado correctamente

---

## 🎉 URLs Finales

- **API Backend**: https://tecnoandamios.huelemu.com.ar/api/v1
- **Health Check**: https://tecnoandamios.huelemu.com.ar/health
- **Login**: POST https://tecnoandamios.huelemu.com.ar/api/v1/auth/login

**Usuario Admin:**
- Email: admin@tecnoandamios.com
- Password: admin123 (⚠️ CAMBIAR EN PRODUCCIÓN)

---

## 🔐 Seguridad Post-Deploy

1. **Cambiar contraseña del usuario admin**:
```bash
# Usar endpoint PUT /api/v1/usuarios/:id desde Postman/Thunder Client
```

2. **Crear usuarios operadores** con roles específicos

3. **Configurar backups automáticos** en aaPanel:
   - Database → tecnoandamios → Backup → Schedule

4. **Monitorear logs regularmente**

---

**Deploy realizado:** 2026-01-19
**Última actualización:** 2026-01-19
