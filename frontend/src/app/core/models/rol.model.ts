export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: any;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}
