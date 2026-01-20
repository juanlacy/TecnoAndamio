# ⚡ Guía de Inicio Rápido

**Para retomar el desarrollo en una nueva sesión**

---

## 🔍 Paso 1: Revisar Estado Actual

### Leer documentos en este orden:
1. 📋 **`RESUMEN_SESION.md`** - Lo que se hizo en la última sesión
2. 📖 **`CONTEXTO_SESION.md`** - Contexto completo del proyecto

### Verificar último commit:
```bash
git log -3 --oneline
```

**Deberías ver:**
```
e609361 docs: Agregar resumen ejecutivo de la sesión
75960e7 docs: Agregar documento de contexto completo del proyecto
2ecc065 feat: Implementar CRUD completo de Usuarios
```

---

## 🚀 Paso 2: Iniciar Desarrollo

### Abrir Visual Studio Code:
```bash
code .
```

### Iniciar servidor de desarrollo:
```bash
cd frontend
npm start
```

La aplicación estará disponible en: **http://localhost:4200**

---

## 📂 Paso 3: Verificar Módulos Completados

### ✅ Clientes (100%)
- Lista: `http://localhost:4200/clientes`
- Crear: `http://localhost:4200/clientes/nuevo`

**Archivos:** `frontend/src/app/features/clientes/`

### ✅ Usuarios (100%)
- Lista: `http://localhost:4200/usuarios`
- Crear: `http://localhost:4200/usuarios/nuevo`

**Archivos:** `frontend/src/app/features/usuarios/`

---

## 🎯 Paso 4: Siguiente Módulo Sugerido

## **MÓDULO DE OBRAS** 🏗️

### Crear estructura base:
```bash
cd frontend
npx ng generate component features/obras/obras-list --skip-tests
npx ng generate component features/obras/obras-form --skip-tests
npx ng generate component features/obras/obras-detail --skip-tests
```

### Crear servicio:
```bash
npx ng generate service core/services/obras --skip-tests
```

### Crear modelo:
```typescript
// frontend/src/app/core/models/obra.model.ts
export interface Obra {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente_id: number;
  cliente?: Cliente;
  direccion: string;
  ciudad: string;
  fecha_inicio: string;
  fecha_termino_estimada?: string;
  estado: 'planificacion' | 'en_curso' | 'suspendida' | 'finalizada';
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateObraDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente_id: number;
  direccion: string;
  ciudad: string;
  fecha_inicio: string;
  fecha_termino_estimada?: string;
  estado: string;
  activo: boolean;
}

export interface UpdateObraDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  cliente_id?: number;
  direccion?: string;
  ciudad?: string;
  fecha_inicio?: string;
  fecha_termino_estimada?: string;
  estado?: string;
  activo?: boolean;
}
```

### Agregar rutas:
```typescript
// frontend/src/app/app.routes.ts
{
  path: 'obras',
  loadComponent: () => import('./features/obras/obras-list/obras-list').then(m => m.ObrasListComponent)
},
{
  path: 'obras/nuevo',
  loadComponent: () => import('./features/obras/obras-form/obras-form').then(m => m.ObrasFormComponent)
},
{
  path: 'obras/:id',
  loadComponent: () => import('./features/obras/obras-detail/obras-detail').then(m => m.ObrasDetailComponent)
},
{
  path: 'obras/:id/editar',
  loadComponent: () => import('./features/obras/obras-form/obras-form').then(m => m.ObrasFormComponent)
}
```

---

## 💡 Tips para Implementar Obras

### 1. **Copiar estructura de Usuarios/Clientes**
Los componentes ya creados son excelentes plantillas.

### 2. **Características especiales de Obras:**
- **Selector de Cliente:** Usar `<mat-select>` con lista de clientes activos
- **Estados:** Chips con colores diferentes según estado
- **Fechas:** Usar `<input type="date">` con validación
- **Validación:** Fecha inicio < fecha término

### 3. **En la lista:**
- Columnas: Código, Nombre, Cliente, Fechas, Estado, Acciones
- Filtro por cliente y estado
- Búsqueda por código o nombre

### 4. **En el formulario:**
```typescript
// Cargar clientes para el selector
clientesService.getAll().subscribe(clientes => {
  this.clientes = clientes.filter(c => c.activo);
});

// FormGroup
this.obraForm = this.fb.group({
  codigo: ['', Validators.required],
  nombre: ['', [Validators.required, Validators.minLength(3)]],
  descripcion: [''],
  cliente_id: ['', Validators.required],
  direccion: ['', Validators.required],
  ciudad: ['', Validators.required],
  fecha_inicio: ['', Validators.required],
  fecha_termino_estimada: [''],
  estado: ['planificacion', Validators.required],
  activo: [true]
});
```

### 5. **Estados con colores:**
```typescript
getEstadoColor(estado: string): string {
  switch (estado) {
    case 'planificacion': return 'accent';
    case 'en_curso': return 'primary';
    case 'suspendida': return 'warn';
    case 'finalizada': return 'default';
    default: return 'default';
  }
}
```

---

## 🎨 Mantener Consistencia Visual

### Copiar estilos de:
- `frontend/src/app/features/usuarios/usuarios-list/usuarios-list.scss`
- `frontend/src/app/features/usuarios/usuarios-form/usuarios-form.scss`
- `frontend/src/app/features/usuarios/usuarios-detail/usuarios-detail.scss`

### Ajustar solo:
- Nombres de clases (`.obras-container` en lugar de `.usuarios-container`)
- Iconos específicos de obras (`construction`)

---

## ✅ Checklist de Implementación

### Obras - Lista
- [ ] Crear componente
- [ ] Implementar servicio
- [ ] Tabla con columnas
- [ ] Búsqueda y filtros
- [ ] Botones de acción
- [ ] Estados visuales
- [ ] Loading state
- [ ] Empty state

### Obras - Formulario
- [ ] Crear componente
- [ ] FormGroup con validaciones
- [ ] Selector de cliente
- [ ] Campos de fecha
- [ ] Selector de estado
- [ ] Toggle activo
- [ ] Validación de fechas
- [ ] Mensajes de error

### Obras - Detalle
- [ ] Crear componente
- [ ] Vista completa
- [ ] Información de cliente
- [ ] Fechas formateadas
- [ ] Estado visual
- [ ] Botón de edición

### Integración
- [ ] Agregar rutas
- [ ] Probar navegación
- [ ] Verificar permisos
- [ ] Compilar sin errores
- [ ] Crear commit

---

## 🔄 Flujo de Trabajo Recomendado

1. **Crear modelos y servicios** → Compilar
2. **Implementar lista** → Probar navegación
3. **Implementar formulario** → Probar crear/editar
4. **Implementar detalle** → Probar vista
5. **Refinar estilos** → Verificar responsive
6. **Testing manual** → Verificar todos los flujos
7. **Commit** → Documentar cambios

---

## 📝 Comandos Git Útiles

```bash
# Ver estado
git status

# Ver últimos commits
git log -5 --oneline

# Crear commit
git add .
git commit -m "feat: Implementar CRUD de Obras

Características:
- Lista de obras con filtros
- Formulario crear/editar
- Vista detalle completa
- Integración con clientes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Ver cambios
git diff
```

---

## 🆘 Solución de Problemas

### Error de compilación:
```bash
# Limpiar y reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Puerto ocupado:
```bash
# Usar puerto alternativo
npm start -- --port 4201
```

### Error de imports:
- Verificar que los nombres de export sean correctos
- Verificar rutas relativas (../../)
- Usar imports de barrel cuando sea posible

---

## 📚 Referencias Rápidas

### Estructura de Componente Standalone:
```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// ... más imports

@Component({
  selector: 'app-nombre',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './nombre.html',
  styleUrl: './nombre.scss'
})
export class NombreComponent implements OnInit {
  private service = inject(NombreService);
  data = signal<Data[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => {
      this.data.set(data);
    });
  }
}
```

---

## 🎯 Meta del Proyecto

**Objetivo:** Sistema completo de gestión de arriendo de andamios

**Progreso actual:** 60% (3 de 5 módulos principales)

**Módulos completados:**
- ✅ Autenticación
- ✅ Clientes
- ✅ Usuarios

**Módulos pendientes:**
- ⏳ Obras (SIGUIENTE)
- ⏳ Equipos
- ⏳ Estados de Pago

---

## 🚀 ¡Manos a la Obra!

**Todo está listo para continuar. ¡Adelante con el módulo de Obras!**

📖 Consulta `CONTEXTO_SESION.md` para más detalles técnicos.

---

**Última actualización:** 2026-01-20
**Commit actual:** `e609361`
