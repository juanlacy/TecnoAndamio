export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface DashboardStats {
  total_clientes: number;
  total_obras: number;
  edps_activos: number;
  edps_por_estado: {
    [key: string]: number;
  };
}
