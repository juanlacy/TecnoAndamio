export interface CategoriaEquipo {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Equipo {
  id: number;
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  disponible: boolean;
  created_at?: string;
  updated_at?: string;
  categoria?: CategoriaEquipo;
  componentes?: ComponenteEquipo[];
}

export interface ComponenteEquipo {
  id: number;
  equipo_id: number;
  nombre: string;
  cantidad: number;
  unidad_medida?: string;
  created_at?: string;
  updated_at?: string;
}
