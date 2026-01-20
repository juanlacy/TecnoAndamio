# 🔍 Verificar Versión del Frontend en Producción

## Problema Reportado

Has actualizado el frontend pero sigues viendo los mismos problemas:
- ❌ No aparece módulo "Usuarios" en el menú
- ❌ Error 500 al cargar otros módulos

## 🎯 Verificaciones Críticas

### 1. ¿Se copiaron los archivos nuevos?

**En el servidor de producción, ejecuta:**

```bash
# Ver fecha de los archivos en el servidor
ls -lh /var/www/tecnoandamio/*.js | head -5

# Ver fecha de la carpeta
stat /var/www/tecnoandamio/
```

**La fecha debería ser de HOY (2026-01-20)**. Si es anterior, los archivos NO se copiaron.

---

### 2. ¿El navegador está usando caché antiguo?

**En el navegador (https://tecnoandamio.huelemu.com.ar):**

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Marca "Disable cache"
4. Haz clic derecho en el botón de recargar
5. Selecciona "Empty Cache and Hard Reload"

O más fácil:
```
Ctrl + Shift + Delete (Windows/Linux)
Cmd + Shift + Delete (Mac)
```
Selecciona "Cached images and files" y borra.

---

### 3. ¿Nginx está cacheando los archivos?

**En el servidor, verifica la configuración de nginx:**

```bash
# Ver configuración del sitio
cat /etc/nginx/sites-available/tecnoandamio

# O si está en otro lugar:
cat /etc/nginx/conf.d/tecnoandamio.conf
```

**Busca directivas de caché:**
```nginx
# Si ves algo como esto, podría estar cacheando:
expires 1y;
add_header Cache-Control "public, immutable";
```

**Solución temporal:** Deshabilitar caché de archivos JS:
```nginx
location ~* \.js$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
}
```

**Luego reinicia nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Ejecutar Script de Debug en el Navegador

**Copia el contenido de `DEBUG_PRODUCCION.js` en la consola del navegador (F12).**

Esto te mostrará:
- ✅ Si el usuario tiene roles correctos
- ✅ Si el backend está respondiendo bien
- ✅ Si el link de "Usuarios" existe en el DOM

---

## 🚀 Procedimiento Completo de Deploy

Si los archivos NO se copiaron correctamente, hazlo así:

### Paso 1: Compilar (ya hecho)
```bash
cd frontend
rm -rf dist/
npm run build
```

### Paso 2: Verificar que se compiló
```bash
ls -lh dist/frontend/browser/*.js | head -5
```

Deberías ver archivos con fecha de HOY.

### Paso 3: Copiar al servidor

**Opción A: Con SCP**
```bash
# Primero respaldar los archivos actuales
ssh usuario@tecnoandamio.huelemu.com.ar "cd /var/www && tar -czf tecnoandamio-backup-$(date +%Y%m%d-%H%M%S).tar.gz tecnoandamio/"

# Copiar archivos nuevos
scp -r dist/frontend/browser/* usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/
```

**Opción B: Con rsync**
```bash
# Más seguro, no copia archivos innecesarios
rsync -avz --delete \
  dist/frontend/browser/ \
  usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/
```

**Opción C: Manualmente**
1. Comprimir: `tar -czf frontend-new.tar.gz dist/frontend/browser/`
2. Subir: `scp frontend-new.tar.gz usuario@servidor:/tmp/`
3. En el servidor:
   ```bash
   cd /var/www/tecnoandamio/
   rm -rf *
   tar -xzf /tmp/frontend-new.tar.gz --strip-components=3
   ```

### Paso 4: Verificar permisos
```bash
ssh usuario@tecnoandamio.huelemu.com.ar
cd /var/www/tecnoandamio/
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
```

### Paso 5: Reiniciar nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Paso 6: Limpiar caché del navegador

1. `Ctrl + Shift + Delete`
2. Marcar "Cached images and files"
3. Borrar
4. Recargar la página (`F5`)

---

## 🐛 Debug: ¿Qué versión estoy viendo?

**En la consola del navegador (F12), ejecuta:**

```javascript
// Ver qué archivos JS se están cargando
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .forEach(r => console.log(r.name));

// Ver si hay errores de carga
console.table(
  performance.getEntriesByType('resource')
    .filter(r => r.name.includes('.js'))
    .map(r => ({
      archivo: r.name.split('/').pop(),
      tamaño: Math.round(r.transferSize / 1024) + ' KB',
      tiempo: Math.round(r.duration) + ' ms',
      cache: r.transferSize === 0 ? 'CACHE' : 'NETWORK'
    }))
);
```

Si ves **"CACHE"** en muchos archivos, el navegador está usando versión antigua.

---

## ✅ Checklist de Verificación

- [ ] Archivos compilados tienen fecha de hoy en local
- [ ] Archivos copiados al servidor
- [ ] Archivos en servidor tienen fecha de hoy
- [ ] Permisos correctos (www-data)
- [ ] Nginx no está cacheando archivos JS
- [ ] Nginx reiniciado
- [ ] Caché del navegador limpiado
- [ ] Hard refresh (Ctrl+F5) en el navegador
- [ ] Script de debug ejecutado
- [ ] Usuario tiene `roles: ['admin']` en localStorage

---

## 📞 Información para Debug

Si después de todo esto sigue sin funcionar, necesito saber:

1. **Output del script de debug** (`DEBUG_PRODUCCION.js`)
2. **Fecha de los archivos en el servidor:**
   ```bash
   ls -lh /var/www/tecnoandamio/*.js | head -3
   ```
3. **Configuración de nginx:**
   ```bash
   cat /etc/nginx/sites-available/tecnoandamio | grep -A 10 "location"
   ```
4. **Screenshot de la consola del navegador** mostrando errores

---

## 🎯 Solución Rápida

Si tienes acceso SSH al servidor:

```bash
# 1. Conectar al servidor
ssh usuario@tecnoandamio.huelemu.com.ar

# 2. Respaldar archivos actuales
cd /var/www
sudo tar -czf tecnoandamio-backup-$(date +%Y%m%d-%H%M%S).tar.gz tecnoandamio/

# 3. Salir
exit

# 4. Copiar archivos nuevos desde tu máquina local
cd C:\Proyecto\TecnoAndamio
rsync -avz --delete frontend/dist/frontend/browser/ usuario@tecnoandamio.huelemu.com.ar:/var/www/tecnoandamio/

# 5. Reiniciar nginx remotamente
ssh usuario@tecnoandamio.huelemu.com.ar "sudo systemctl reload nginx"
```

Luego en tu navegador: `Ctrl + Shift + Delete` → Borrar caché → `Ctrl + F5`

---

**Última actualización:** 2026-01-20
**Estado:** Instrucciones completas de troubleshooting
