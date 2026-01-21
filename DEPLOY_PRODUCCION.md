# 🚀 Deploy a Producción - TecnoAndamio

## ✅ Cambios Committed y Pushed

**Commit:** `4cfbe92` - fix: Corregir compatibilidad de roles entre frontend y backend

Los cambios ya están en GitHub. Ahora necesitas actualizarlos en producción.

---

## 🎯 Pasos para Deploy

### Opción 1: Pull en el Servidor (Recomendado)

**Conecta al servidor:**
```bash
ssh usuario@tecnoandamio.huelemu.com.ar
```

**Actualiza el código:**
```bash
# 1. Ir al directorio del proyecto
cd /ruta/al/proyecto/TecnoAndamio

# 2. Hacer backup
tar -czf ../backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# 3. Pull de los cambios
git pull origin main

# 4. Compilar el frontend
cd frontend
npm run build

# 5. Copiar archivos compilados al directorio web
sudo cp -r dist/frontend/browser/* /var/www/tecnoandamio/

# 6. Ajustar permisos
sudo chown -R www-data:www-data /var/www/tecnoandamio/
sudo chmod -R 755 /var/www/tecnoandamio/

# 7. Reiniciar nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

### Opción 2: Deploy desde Windows (Si no tienes git en servidor)

**En tu máquina Windows:**

```bash
# 1. Compilar el frontend (si no lo hiciste ya)
cd frontend
npm run build

# 2. Copiar archivos al servidor
rsync -avz --delete dist/frontend/browser/ usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/

# 3. Conectar al servidor para ajustar permisos
ssh usuario@tecnoandamio.huelemu.com.ar "sudo chown -R www-data:www-data /var/www/tecnoandamio/ && sudo chmod -R 755 /var/www/tecnoandamio/ && sudo systemctl reload nginx"
```

---

### Opción 3: Deploy Manual (Si rsync no funciona)

```bash
# 1. Comprimir archivos
cd frontend/dist/frontend/browser
tar -czf frontend-deploy.tar.gz .

# 2. Subir al servidor
scp frontend-deploy.tar.gz usuario@tecnoandamio.huelemu.com.ar:/tmp/

# 3. Conectar al servidor
ssh usuario@tecnoandamio.huelemu.com.ar

# 4. Descomprimir y copiar
cd /var/www/tecnoandamio/
sudo rm -rf *
sudo tar -xzf /tmp/frontend-deploy.tar.gz
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo systemctl reload nginx
exit
```

---

## 🧹 Limpiar Caché del Navegador

**IMPORTANTE:** Después del deploy, DEBES limpiar el caché:

1. **Abrir el sitio:** https://tecnoandamio.huelemu.com.ar
2. **Presionar:** `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
3. **Seleccionar:** "Imágenes y archivos en caché"
4. **Rango:** "Desde siempre"
5. **Borrar**
6. **Cerrar completamente el navegador**
7. **Abrir de nuevo**
8. **Presionar:** `Ctrl + F5` (hard refresh)

O más rápido: **Modo incógnito** para probar

---

## ✅ Verificación Post-Deploy

### 1. Limpia localStorage

**En la consola del navegador (F12):**
```javascript
localStorage.clear();
location.reload();
```

### 2. Haz login nuevamente

- Email: `demo@demo.com`
- Password: `demo123`

### 3. Verifica que se solucionó

**Ejecuta en la consola (F12):**
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Roles:', user.roles);
console.log('Tipo:', Array.isArray(user.roles) ? 'Array ✅' : 'ERROR');
```

**Deberías ver:**
```javascript
{
  id: 1,
  nombre: "Usuario Demo",
  email: "demo@demo.com",
  roles: ["admin"],  // ← Array de strings
  activo: true
}
```

### 4. Verifica el menú

Deberías ver estos items:
- ✅ Dashboard
- ✅ Clientes
- ✅ Obras
- ✅ Equipos
- ✅ EDPs
- ✅ **Usuarios** ← ¡Ahora debe aparecer!

### 5. Prueba el módulo de Obras

1. Haz clic en "Obras"
2. **NO debe haber error 500**
3. Debe cargar correctamente

---

## 🐛 Si Aún Hay Problemas

### Problema: Sigo sin ver "Usuarios"

**Solución:**
```javascript
// En consola del navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
// Vuelve a hacer login
```

### Problema: Archivos no se actualizaron

**Verificar en el servidor:**
```bash
ls -lh /var/www/tecnoandamio/*.js | head -5
```

La fecha debe ser de HOY. Si no, los archivos no se copiaron.

### Problema: Nginx está cacheando

**Deshabilitar caché temporalmente:**
```bash
ssh usuario@tecnoandamio.huelemu.com.ar
sudo nano /etc/nginx/sites-available/tecnoandamio
```

Agregar:
```nginx
location ~* \.js$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Checklist Final

- [ ] Git pull en servidor (o archivos copiados manualmente)
- [ ] Frontend compilado (`npm run build`)
- [ ] Archivos copiados a `/var/www/tecnoandamio/`
- [ ] Permisos ajustados (www-data)
- [ ] Nginx reiniciado
- [ ] Caché del navegador limpiado
- [ ] Hard refresh (Ctrl+F5)
- [ ] LocalStorage limpiado
- [ ] Login realizado con demo@demo.com
- [ ] Usuario tiene `roles: ["admin"]` en localStorage
- [ ] Módulo "Usuarios" aparece en el menú
- [ ] Módulo "Obras" carga sin error 500

---

## 🎉 Cuando Todo Funcione

Deberías ver:
- ✅ Módulo "Usuarios" en el menú lateral
- ✅ Todos los módulos cargan sin errores
- ✅ No hay error 500 en ningún endpoint
- ✅ El usuario tiene correctamente `roles: ["admin"]`

---

**Fecha:** 2026-01-20
**Commit:** 4cfbe92
**Branch:** main
**Estado:** ✅ Listo para deploy
