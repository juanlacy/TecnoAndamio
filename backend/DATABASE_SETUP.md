# Configuración de Base de Datos - TecnoAndamios

## Requisitos Previos

- MySQL 8.0 o superior instalado
- Acceso como usuario root de MySQL

## Opción 1: Script Automático (Recomendado)

### Windows

Abre PowerShell o CMD y ejecuta:

```bash
cd C:\Proyecto\TecnoAndamio\backend
mysql -u root -p < setup-database.sql
```

Ingresa la contraseña de root cuando se solicite.

### Linux/Mac

```bash
cd /path/to/backend
mysql -u root -p < setup-database.sql
```

## Opción 2: Comandos Manuales

Si prefieres ejecutar los comandos manualmente, abre MySQL como root:

```bash
mysql -u root -p
```

Luego ejecuta estos comandos en el prompt de MySQL:

```sql
-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS tecnoandamios_db
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. Crear usuario
CREATE USER IF NOT EXISTS 'tecnoandamios_user'@'localhost'
IDENTIFIED BY 'tecnoandamios_pass';

-- 3. Otorgar privilegios
GRANT ALL PRIVILEGES ON tecnoandamios_db.*
TO 'tecnoandamios_user'@'localhost';

-- 4. Aplicar cambios
FLUSH PRIVILEGES;

-- 5. Verificar privilegios
SHOW GRANTS FOR 'tecnoandamios_user'@'localhost';

-- 6. Salir
EXIT;
```

## Verificar Configuración

Verifica que puedes conectarte con las nuevas credenciales:

```bash
mysql -u tecnoandamios_user -p tecnoandamios_db
```

Contraseña: `tecnoandamios_pass`

## Ejecutar Migraciones

Una vez configurada la base de datos, ejecuta las migraciones:

```bash
cd backend
npm run migrate
```

Deberías ver:

```
== 20260116000001-create-usuarios: migrating =======
== 20260116000001-create-usuarios: migrated (0.XXXs)
...
== 20260116000014-create-edp-estados-historico: migrated (0.XXXs)
```

## Ejecutar Seeders

Para poblar la base de datos con datos iniciales:

```bash
npm run seed
```

Esto creará:
- 3 Roles: Admin, Supervisor, Operador
- 1 Usuario admin (admin@tecnoandamios.com / admin123)
- 5 Categorías de equipos
- 6 Tipos de servicio

## Solución de Problemas

### Error: Access denied

Si obtienes `Access denied for user 'tecnoandamios_user'@'localhost'`:

1. Verifica que ejecutaste el script `setup-database.sql` como root
2. Verifica las credenciales en `backend/.env`
3. Intenta reconectarte:

```bash
mysql -u root -p
FLUSH PRIVILEGES;
EXIT;
```

### Error: Database doesn't exist

Si la base de datos no existe:

```bash
mysql -u root -p
CREATE DATABASE tecnoandamios_db;
EXIT;
```

### Error: Plugin caching_sha2_password

Si usas versiones antiguas de clientes MySQL, cambia el método de autenticación:

```sql
ALTER USER 'tecnoandamios_user'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'tecnoandamios_pass';
FLUSH PRIVILEGES;
```

## Restablecer Base de Datos

Para eliminar y recrear la base de datos desde cero:

```bash
# 1. Deshacer migraciones
npm run migrate:undo

# 2. Ejecutar migraciones nuevamente
npm run migrate

# 3. Ejecutar seeders
npm run seed
```

## Credenciales por Defecto

### Base de Datos
- **Host**: localhost
- **Puerto**: 3306
- **Database**: tecnoandamios_db
- **Usuario**: tecnoandamios_user
- **Contraseña**: tecnoandamios_pass

### Usuario Admin (después de seeders)
- **Email**: admin@tecnoandamios.com
- **Contraseña**: admin123
- **Rol**: Admin

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción!
