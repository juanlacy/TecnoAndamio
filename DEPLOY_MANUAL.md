# 📦 Deploy Manual del Frontend a Producción

## Método 1: Usando el Script Automático (Recomendado)

**Desde tu máquina local (Windows/WSL):**

```bash
cd C:\Proyecto\TecnoAndamio

# Dar permisos de ejecución al script
chmod +x DEPLOY_FRONTEND_PRODUCCION.sh

# Ejecutar el script
bash DEPLOY_FRONTEND_PRODUCCION.sh
```

**IMPORTANTE:** Edita primero el script y actualiza estas variables:
- `SERVER_USER`: Tu usuario SSH
- `SERVER_HOST`: `tecnoandamio.huelemu.com.ar`
- `SERVER_PATH`: Ruta en el servidor donde está el frontend

---

## Método 2: Copiar Archivos Manualmente

### Opción A: Usando SCP

**En tu máquina local:**

```bash
cd C:\Proyecto\TecnoAndamio

# 1. Comprimir el build
cd frontend/dist/frontend
tar -czf frontend-deploy.tar.gz browser/

# 2. Copiar al servidor
scp frontend-deploy.tar.gz usuario@tecnoandamio.huelemu.com.ar:/tmp/

# 3. Conectar al servidor
ssh usuario@tecnoandamio.huelemu.com.ar
```

**En el servidor:**

```bash
# 4. Hacer backup
cd /var/www
sudo tar -czf tecnoandamio-backup-$(date +%Y%m%d-%H%M%S).tar.gz tecnoandamio/

# 5. Descomprimir archivos nuevos
cd /var/www/tecnoandamio
sudo rm -rf *
sudo tar -xzf /tmp/frontend-deploy.tar.gz --strip-components=1

# 6. Ajustar permisos
sudo chown -R www-data:www-data .
sudo chmod -R 755 .

# 7. Reiniciar nginx
sudo nginx -t
sudo systemctl reload nginx

# 8. Limpiar temporal
rm /tmp/frontend-deploy.tar.gz

# 9. Verificar archivos
ls -lh *.js | head -5
```

---

### Opción B: Usando SFTP

**Si tienes un cliente SFTP como WinSCP o FileZilla:**

1. **Conectar al servidor:**
   - Host: `tecnoandamio.huelemu.com.ar`
   - Usuario: tu usuario SSH
   - Puerto: 22

2. **Navegar al directorio local:**
   - `C:\Proyecto\TecnoAndamio\frontend\dist\frontend\browser`

3. **Navegar al directorio remoto:**
   - `/var/www/tecnoandamio`

4. **Hacer backup primero:**
   - Conectar por SSH y ejecutar:
     ```bash
     cd /var/www
     sudo tar -czf tecnoandamio-backup-$(date +%Y%m%d-%H%M%S).tar.gz tecnoandamio/
     ```

5. **Borrar archivos antiguos:**
   - Seleccionar todo en `/var/www/tecnoandamio`
   - Eliminar (asegúrate de tener backup)

6. **Subir archivos nuevos:**
   - Arrastrar todos los archivos desde `browser/` a `/var/www/tecnoandamio/`
   - Esperar a que termine la transferencia

7. **Ajustar permisos por SSH:**
   ```bash
   ssh usuario@tecnoandamio.huelemu.com.ar
   sudo chown -R www-data:www-data /var/www/tecnoandamio/
   sudo chmod -R 755 /var/www/tecnoandamio/
   sudo systemctl reload nginx
   ```

---

### Opción C: Desde Git (Si el servidor tiene acceso al repo)

**En el servidor:**

```bash
# 1. Ir al directorio del proyecto
cd /ruta/al/proyecto/TecnoAndamio

# 2. Pull de los cambios
git pull origin main

# 3. Instalar dependencias (si es necesario)
cd frontend
npm install

# 4. Compilar en el servidor
npm run build

# 5. Copiar archivos al directorio web
sudo rm -rf /var/www/tecnoandamio/*
sudo cp -r dist/frontend/browser/* /var/www/tecnoandamio/

# 6. Ajustar permisos
sudo chown -R www-data:www-data /var/www/tecnoandamio/
sudo chmod -R 755 /var/www/tecnoandamio/

# 7. Reiniciar nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Verificación Post-Deploy

**1. Verificar que los archivos se copiaron:**

```bash
# En el servidor
ls -lh /var/www/tecnoandamio/*.js | head -5
```

**Deberías ver archivos con fecha de HOY.**

**2. Verificar permisos:**

```bash
ls -la /var/www/tecnoandamio/ | head -10
```

**Deberías ver `www-data` como owner.**

**3. Verificar que nginx está funcionando:**

```bash
sudo nginx -t
sudo systemctl status nginx
```

---

## 🧹 Limpiar Caché del Navegador

**CRÍTICO:** Después del deploy, los usuarios deben limpiar el caché:

### Método 1: Hard Refresh

1. Abrir https://tecnoandamio.huelemu.com.ar
2. Presionar `Ctrl + F5` (Windows/Linux) o `Cmd + Shift + R` (Mac)

### Método 2: Borrar Caché Completo

1. Presionar `Ctrl + Shift + Delete`
2. Seleccionar "Cached images and files"
3. Seleccionar "All time"
4. Hacer clic en "Clear data"
5. Cerrar el navegador completamente
6. Abrir de nuevo

### Método 3: Modo Incógnito (Para Probar)

1. Presionar `Ctrl + Shift + N` (Chrome) o `Ctrl + Shift + P` (Firefox)
2. Ir a https://tecnoandamio.huelemu.com.ar
3. Esto cargará la versión nueva sin caché

### Método 4: DevTools (Recomendado para desarrolladores)

1. Abrir https://tecnoandamio.huelemu.com.ar
2. Presionar F12 (abrir DevTools)
3. Ir a pestaña "Network"
4. Marcar checkbox "Disable cache"
5. Hacer clic derecho en el botón de recargar
6. Seleccionar "Empty Cache and Hard Reload"

---

## 🔍 Verificar que Funciona

**En el navegador (F12 → Console):**

```javascript
// Verificar archivos cargados
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .forEach(r => {
    const fromCache = r.transferSize === 0;
    console.log(
      fromCache ? '⚠️ CACHE:' : '✅ NETWORK:',
      r.name.split('/').pop()
    );
  });
```

**Si ves muchos archivos con "⚠️ CACHE", necesitas limpiar el caché.**

**Probar login y endpoints:**

```javascript
// 1. Limpiar localStorage
localStorage.clear();

// 2. Ir a login
location.href = '/login';

// Después de hacer login, verificar:
fetch('/api/v1/auth/me', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(d => console.log('Auth check:', d.success ? '✅ OK' : '❌ FAIL'));
```

---

## 📋 Checklist de Deploy

- [ ] Frontend compilado localmente (`npm run build`)
- [ ] Archivos verificados en `frontend/dist/frontend/browser/`
- [ ] Backup creado en el servidor
- [ ] Archivos copiados al servidor
- [ ] Archivos en `/var/www/tecnoandamio/` tienen fecha de hoy
- [ ] Permisos configurados (www-data:www-data)
- [ ] Nginx reiniciado sin errores
- [ ] Caché del navegador limpiado
- [ ] Hard refresh realizado (Ctrl+F5)
- [ ] LocalStorage limpiado
- [ ] Login funciona correctamente
- [ ] Módulos cargan sin errores
- [ ] No hay errores en la consola del navegador

---

## 🐛 Troubleshooting

### Problema: Sigo viendo archivos antiguos

**Solución:**
```bash
# En el servidor, verificar fecha de archivos
ls -lh /var/www/tecnoandamio/*.js | head -5

# Si no tienen fecha de hoy, los archivos no se copiaron
# Repite el proceso de deploy
```

### Problema: Nginx no sirve archivos nuevos

**Solución:**
```bash
# Verificar configuración nginx
sudo nginx -t

# Ver logs de nginx
sudo tail -f /var/log/nginx/error.log

# Reiniciar nginx forzadamente
sudo systemctl restart nginx
```

### Problema: Sigo viendo errores de "pipe"

**Solución:**
1. Los archivos viejos siguen en caché del navegador
2. Presiona Ctrl+Shift+Delete
3. Borra TODO el caché
4. Cierra el navegador completamente
5. Abre en modo incógnito para probar

### Problema: 404 en algunos archivos

**Solución:**
```bash
# Verificar que todos los archivos se copiaron
cd /var/www/tecnoandamio
ls -lh | wc -l

# Debería haber ~50-60 archivos
# Si hay menos, algo falló en la copia
```

---

**Última actualización:** 2026-01-20
**Estado:** Guía completa para deploy manual
