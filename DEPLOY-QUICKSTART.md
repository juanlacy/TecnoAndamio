# ⚡ Deploy Rápido - TecnoAndamio

## 🎯 Comandos Esenciales (Copy & Paste)

### 1️⃣ Primera Instalación

```bash
# En el servidor (aaPanel)
cd /www/wwwroot/
git clone https://github.com/juanlacy/TecnoAndamio.git
cd TecnoAndamio

# Backend
cd backend
npm install
cp .env.example .env
# ⚠️ EDITAR .env con tus datos
nano .env
pm2 start npm --name "tecnoandamio-backend" -- start
pm2 save
pm2 startup

# Frontend
cd ../frontend
npm install
npm run build

# Verificar
pm2 status
ls -la dist/frontend/browser/
```

### 2️⃣ Configurar Nginx

```bash
# Crear archivo de configuración
nano /www/server/panel/vhost/nginx/tecnoandamio.conf
```

Pegar esta configuración (ajustar `tudominio.com`):

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    access_log /www/wwwlogs/tecnoandamio_access.log;
    error_log /www/wwwlogs/tecnoandamio_error.log;

    root /www/wwwroot/TecnoAndamio/frontend/dist/frontend/browser;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Verificar y aplicar
nginx -t
systemctl reload nginx
```

### 3️⃣ Base de Datos

```bash
# Desde aaPanel > Database > Add database
# O por consola:
mysql -u root -p
```

```sql
CREATE DATABASE tecnoandamio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tecnoandamio_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON tecnoandamio_db.* TO 'tecnoandamio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4️⃣ Variables de Entorno (.env)

```env
# /www/wwwroot/TecnoAndamio/backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tecnoandamio_user
DB_PASSWORD=tu_password_seguro
DB_NAME=tecnoandamio_db

JWT_SECRET=cambiar_por_secret_super_seguro_de_al_menos_32_caracteres
JWT_EXPIRES_IN=24h

PORT=9000
NODE_ENV=production

CORS_ORIGIN=https://tudominio.com
```

### 5️⃣ SSL (Let's Encrypt)

```bash
# Opción 1: Desde aaPanel
# Website > Tu sitio > SSL > Let's Encrypt > Apply

# Opción 2: Manual
certbot --nginx -d tudominio.com -d www.tudominio.com
```

---

## 🔄 Actualizaciones Futuras

```bash
# Copiar script de actualización
cd /www/wwwroot/TecnoAndamio
chmod +x update.sh

# Ejecutar cuando haya nuevos cambios
./update.sh
```

O manualmente:

```bash
cd /www/wwwroot/TecnoAndamio
git pull origin main

# Backend
cd backend && npm install && pm2 restart tecnoandamio-backend && cd ..

# Frontend
cd frontend && npm install && npm run build && cd ..

# Nginx
nginx -t && systemctl reload nginx
```

---

## 🐛 Troubleshooting Rápido

### Backend no responde
```bash
pm2 logs tecnoandamio-backend --lines 50
pm2 restart tecnoandamio-backend
```

### Frontend muestra error
```bash
# Verificar build
ls -la /www/wwwroot/TecnoAndamio/frontend/dist/frontend/browser/

# Rebuild
cd /www/wwwroot/TecnoAndamio/frontend
npm run build
```

### Nginx error
```bash
nginx -t
tail -f /www/wwwlogs/tecnoandamio_error.log
systemctl restart nginx
```

### API no conecta
```bash
# Verificar puerto
netstat -tuln | grep 9000

# Verificar backend
curl http://localhost:9000/api/v1/health

# Verificar .env
cat /www/wwwroot/TecnoAndamio/backend/.env | grep PORT
```

---

## ✅ Verificación Post-Deploy

```bash
# 1. Backend health check
curl http://localhost:9000/api/v1/health

# 2. PM2 status
pm2 status

# 3. Nginx status
systemctl status nginx

# 4. Logs en vivo
pm2 logs tecnoandamio-backend
```

Navegar a: `https://tudominio.com`

---

## 📊 Monitoreo

```bash
# Ver uso de recursos
pm2 monit

# Ver logs en tiempo real
pm2 logs tecnoandamio-backend --lines 100

# Ver estado
pm2 status
```

---

## 🔐 Seguridad Post-Deploy

```bash
# 1. Cambiar secret JWT en .env
# 2. Crear usuario admin en la base de datos
# 3. Configurar firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 4. Instalar fail2ban (opcional)
apt-get install fail2ban
systemctl enable fail2ban
```

---

## 📝 Checklist

- [ ] Git clonado
- [ ] Backend instalado y corriendo en PM2
- [ ] Frontend buildeado
- [ ] Base de datos creada
- [ ] .env configurado correctamente
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Dominio apuntando al servidor
- [ ] Aplicación accesible en navegador
- [ ] Login funciona
- [ ] CRUD de clientes funciona

---

## 🆘 Ayuda

**Documentación completa**: Ver `DEPLOY-PRODUCCION.md`

**Logs importantes**:
- Backend: `pm2 logs tecnoandamio-backend`
- Nginx: `/www/wwwlogs/tecnoandamio_error.log`
- MySQL: `/www/server/data/*.err`

**Comandos útiles**:
```bash
pm2 restart all          # Reiniciar todos los procesos
pm2 stop all            # Detener todos
pm2 delete all          # Eliminar todos
systemctl restart nginx # Reiniciar Nginx
systemctl restart mysql # Reiniciar MySQL
```

---

**Versión**: 1.0 (Fases 1-6)
**Fecha**: 2026-01-20
