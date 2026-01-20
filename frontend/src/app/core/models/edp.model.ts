export interface TipoServicio {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export type EstadoEDP = 'Borrador' | 'Abierto' | 'Cerrado' | 'Validado' | 'Facturado' | 'Cobrado';

export interface EDP {
  id: number;
  numero: string;
  cliente_id: number;
  obra_id: number;
  estado: EstadoEDP;
  fecha_emision: string;
  fecha_cierre?: string;
  observaciones?: string;
  total?: number;
  created_at?: string;
  updated_at?: string;
  cliente?: {
    id: number;
    razon_social: string;
    rut: string;
  };
  obra?: {
    id: number;
    codigo: string;
    nombre: string;
  };
  detalles?: DetalleEDP[];
}

export interface DetalleEDP {
  id: number;
  edp_id: number;
  equipo_id: number;
  tipo_servicio_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  equipo?: {
    id: number;
    codigo: string;
    nombre: string;
  };
  tipo_servicio?: {
    id: number;
    nombre: string;
  };
}

export interface HistorialEDP {
  id: number;
  edp_id: number;
  usuario_id: number;
  estado_anterior?: EstadoEDP;
  estado_nuevo: EstadoEDP;
  observaciones?: string;
  created_at: string;
  usuario?: {
    id: number;
    nombre: string;
  };
}
