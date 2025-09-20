export interface RegisterEndpointRequest {
  url: string;
  data: Record<string, any>;
}

export interface RegisterEndpointResponse {
  success: boolean;
  message: string;
  endpoint: {
    id: number;
    url: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface EndpointListResponse {
  success: boolean;
  endpoints: Array<{
    id: number;
    url: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
