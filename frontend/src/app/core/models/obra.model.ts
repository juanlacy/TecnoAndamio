export interface Obra {
  id: number;
  cliente_id: number;
  codigo: string;
  nombre: string;
  direccion?: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  activa: boolean;
  created_at?: string;
  updated_at?: string;
  cliente?: {
    id: number;
    razon_social: string;
    rut: string;
  };
}
