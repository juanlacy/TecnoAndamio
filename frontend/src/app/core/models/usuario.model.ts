export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: string;  // Nombre del rol principal (para compatibilidad)
  roles?: (Rol | string)[];  // Array flexible: objetos Rol del backend o strings
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    usuario: Usuario;
  };
}

export interface AuthUser {
  token: string;
  usuario: Usuario;
}

export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  roles: number[];  // Array de IDs de roles
  activo: boolean;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password?: string;
  roles?: number[];  // Array de IDs de roles
  activo?: boolean;
}
