export interface Obra {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente_id: number;
  cliente?: {
    id: number;
    razon_social: string;
    rut: string;
    nombre_fantasia?: string;
  };
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
  estado: 'planificacion' | 'en_curso' | 'suspendida' | 'finalizada';
  activo?: boolean;
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
  estado?: 'planificacion' | 'en_curso' | 'suspendida' | 'finalizada';
  activo?: boolean;
}
