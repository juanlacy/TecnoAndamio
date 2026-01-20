export interface Cliente {
  id: number;
  rut: string;
  razon_social: string;
  nombre_fantasia?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  contactos?: Contacto[];
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
