export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;  // 'admin' | 'usuario'
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  roles?: Rol[];
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
  rol: string;
  activo: boolean;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
  activo?: boolean;
}
