export interface CategoriaEquipo {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ComponenteEquipo {
  id: number;
  equipo_id: number;
  nombre: string;
  unidad: string;
  precio_unitario_uf: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Equipo {
  id: number;
  categoria_id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  especificaciones?: any;
  disponible: boolean;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  categoria?: CategoriaEquipo;
  componentes?: ComponenteEquipo[];
}

export interface CreateEquipoDto {
  categoria_id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  especificaciones?: any;
  disponible?: boolean;
  activo?: boolean;
}

export interface UpdateEquipoDto {
  categoria_id?: number;
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  especificaciones?: any;
  disponible?: boolean;
  activo?: boolean;
}
