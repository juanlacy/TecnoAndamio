# 🚀 Guía de Deploy a Producción - aaPanel

## 📋 Pre-requisitos

- aaPanel instalado y configurado
- Node.js v22.16.0 (o superior)
- npm 11.7.0 (o superior)
- PM2 para gestión de procesos
- Nginx configurado como reverse proxy

---

## 🔧 Paso 1: Conectarse al Servidor

```bash
ssh tu-usuario@tu-servidor.com
cd /www/wwwroot/
```

---

## 📥 Paso 2: Clonar/Actualizar Repositorio

### Si es primera vez:
```bash
git clone https://github.com/juanlacy/TecnoAndamio.git
cd TecnoAndamio
```

### Si ya existe:
```bash
cd TecnoAndamio
git pull origin main
```

---

## 🎨 Paso 3: Configurar y Build del Frontend

### 3.1. Instalar dependencias
```bash
cd frontend
npm install
```

### 3.2. Verificar configuración de producción

Editar `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: '/api/v1'  // Ruta relativa para producción
};
```

### 3.3. Build de producción
```bash
npm run build
```

Esto generará la carpeta `frontend/dist/frontend/browser/` con los archivos estáticos.

### 3.4. Verificar build
```bash
ls -lh dist/frontend/browser/
```

Deberías ver archivos como:
- `index.html`
- `main-*.js`
- `polyfills-*.js`
- `styles-*.css`

---

## ⚙️ Paso 4: Configurar Backend con PM2

### 4.1. Instalar dependencias del backend
```bash
cd ../backend
npm install
```

### 4.2. Verificar variables de entorno

Editar `/www/wwwroot/TecnoAndamio/backend/.env`:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tecnoandamio_user
DB_PASSWORD=tu_password_seguro
DB_NAME=tecnoandamio_db

# JWT
JWT_SECRET=tu_secret_key_muy_seguro_aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=9000
NODE_ENV=production

# CORS (ajusta según tu dominio)
CORS_ORIGIN=https://tudominio.com
```

### 4.3. Detener proceso anterior (si existe)
```bash
pm2 delete tecnoandamio-backend
```

### 4.4. Iniciar backend con PM2
```bash
pm2 start npm --name "tecnoandamio-backend" -- start
pm2 save
pm2 startup
```

### 4.5. Verificar que esté corriendo
```bash
pm2 status
pm2 logs tecnoandamio-backend
```

---

## 🌐 Paso 5: Configurar Nginx

### 5.1. Crear configuración de sitio

Crear/editar archivo: `/www/server/panel/vhost/nginx/tecnoandamio.conf`

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

    # Logs
    access_log /www/wwwlogs/tecnoandamio_access.log;
    error_log /www/wwwlogs/tecnoandamio_error.log;

    # Root para archivos estáticos del frontend
    root /www/wwwroot/TecnoAndamio/frontend/dist/frontend/browser;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy para API backend
    location /api {
        proxy_pass http://localhost:9000;
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

    # SPA: Todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Seguridad: Negar acceso a archivos ocultos
    location ~ /\. {
        deny all;
    }
}
```

### 5.2. Configurar HTTPS con Let's Encrypt (Opcional pero recomendado)

Desde aaPanel:
1. Ir a **Website** > Tu sitio > **SSL**
2. Seleccionar **Let's Encrypt**
3. Ingresar email y dominio
4. Click en **Apply**

O manualmente:
```bash
# Instalar certbot si no está
apt-get install certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d tudominio.com -d www.tudominio.com
```

### 5.3. Configuración HTTPS (después de SSL)

Editar `/www/server/panel/vhost/nginx/tecnoandamio.conf`:

```nginx
# HTTP - Redirigir a HTTPS
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Resto de la configuración (igual que arriba)
    access_log /www/wwwlogs/tecnoandamio_access.log;
    error_log /www/wwwlogs/tecnoandamio_error.log;

    root /www/wwwroot/TecnoAndamio/frontend/dist/frontend/browser;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }
}
```

### 5.4. Probar y reiniciar Nginx
```bash
nginx -t
systemctl reload nginx
# o desde aaPanel
service nginx reload
```

---

## 🗄️ Paso 6: Configurar Base de Datos

### 6.1. Crear base de datos en aaPanel

1. Ir a **Database** > **Add database**
2. Nombre: `tecnoandamio_db`
3. Usuario: `tecnoandamio_user`
4. Contraseña: (Generar segura)

### 6.2. Importar schema (si existe)
```bash
mysql -u tecnoandamio_user -p tecnoandamio_db < backend/database/schema.sql
```

### 6.3. Verificar conexión
```bash
cd /www/wwwroot/TecnoAndamio/backend
npm run test:db
# o
node -e "require('./src/config/database').testConnection()"
```

---

## ✅ Paso 7: Verificar Deploy

### 7.1. Verificar backend
```bash
curl http://localhost:9000/api/v1/health
# Debería responder con status 200
```

### 7.2. Verificar frontend
```bash
curl http://localhost
# Debería devolver el HTML de Angular
```

### 7.3. Verificar desde navegador
```
https://tudominio.com
```

Deberías ver la pantalla de login de TecnoAndamio.

### 7.4. Verificar logs
```bash
# Backend
pm2 logs tecnoandamio-backend

# Nginx
tail -f /www/wwwlogs/tecnoandamio_access.log
tail -f /www/wwwlogs/tecnoandamio_error.log
```

---

## 🔄 Actualizar Deploy (Futuras Actualizaciones)

```bash
#!/bin/bash
# Script de actualización: /www/wwwroot/TecnoAndamio/update.sh

echo "🔄 Actualizando TecnoAndamio..."

# 1. Pull cambios
cd /www/wwwroot/TecnoAndamio
git pull origin main

# 2. Actualizar backend
echo "📦 Actualizando backend..."
cd backend
npm install
pm2 restart tecnoandamio-backend

# 3. Actualizar frontend
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

# 4. Limpiar cache de Nginx (opcional)
echo "🧹 Limpiando cache..."
# Si usas cache en nginx, limpiar aquí

# 5. Reload Nginx
echo "🌐 Reloading Nginx..."
nginx -t && systemctl reload nginx

echo "✅ Actualización completada!"
pm2 status
```

Hacer ejecutable:
```bash
chmod +x /www/wwwroot/TecnoAndamio/update.sh
```

Usar:
```bash
/www/wwwroot/TecnoAndamio/update.sh
```

---

## 🛡️ Seguridad Adicional

### 1. Firewall
```bash
# Permitir solo puertos necesarios
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 2. Fail2Ban (protección contra brute force)
```bash
apt-get install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Variables de entorno sensibles
- Nunca commitear `.env` al repositorio
- Usar valores seguros en producción
- Rotar secretos JWT periódicamente

---

## 📊 Monitoreo

### PM2 Monitoring
```bash
pm2 monit
```

### Logs en tiempo real
```bash
# Backend
pm2 logs tecnoandamio-backend --lines 100

# Nginx access
tail -f /www/wwwlogs/tecnoandamio_access.log

# Nginx errors
tail -f /www/wwwlogs/tecnoandamio_error.log
```

### Estado del sistema
```bash
pm2 status
systemctl status nginx
systemctl status mysql
```

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar logs
pm2 logs tecnoandamio-backend

# Verificar puerto
netstat -tuln | grep 9000

# Reintentar
pm2 restart tecnoandamio-backend
```

### Frontend muestra error 404
```bash
# Verificar build
ls -la /www/wwwroot/TecnoAndamio/frontend/dist/frontend/browser/

# Verificar permisos
chmod -R 755 /www/wwwroot/TecnoAndamio/frontend/dist/

# Verificar Nginx
nginx -t
tail -f /www/wwwlogs/tecnoandamio_error.log
```

### API no responde
```bash
# Verificar que backend esté corriendo
pm2 status

# Verificar proxy en Nginx
curl http://localhost:9000/api/v1/health

# Verificar configuración de Nginx
nginx -t
```

### Errores de CORS
- Verificar `CORS_ORIGIN` en `.env` del backend
- Verificar headers en Nginx
- Verificar `apiUrl` en `environment.prod.ts`

---

## 📝 Checklist de Deploy

- [ ] Backend corriendo en PM2
- [ ] Base de datos creada y conectada
- [ ] Frontend buildeado en `/dist`
- [ ] Nginx configurado como reverse proxy
- [ ] SSL/HTTPS configurado (Let's Encrypt)
- [ ] Firewall configurado
- [ ] Variables de entorno de producción configuradas
- [ ] Logs funcionando correctamente
- [ ] Dominio apuntando al servidor
- [ ] Prueba de login exitosa
- [ ] Prueba de CRUD de clientes exitosa

---

## 🎉 Deploy Completado

Tu aplicación TecnoAndamio debería estar corriendo en:
- **Frontend**: https://tudominio.com
- **API**: https://tudominio.com/api/v1

**Credenciales por defecto** (cambiar inmediatamente):
- Email: admin@tecnoandamio.com
- Password: (definir en seed o crear manualmente)

---

**Última actualización**: 2026-01-20
**Versión**: Frontend v1.0 (Fases 1-6)
