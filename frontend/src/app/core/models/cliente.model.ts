export interface Cliente {
  id: number;
  empresa: string;
  rut: string;
  direccion?: string;
  rubro?: string;
  correo_empresa?: string;
  usuario_responsable_id?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  contactos?: Contacto[];
  responsable?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface Contacto {
  id: number;
  cliente_id: number;
  nombre: string;
  cargo?: string;
  email?: string;
  telefono?: string;
  created_at?: string;
  updated_at?: string;
}
