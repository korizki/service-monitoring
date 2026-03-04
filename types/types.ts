export interface ServiceLocation {
  site: string;
  company: string;
  url: string;
  assets: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export interface ServiceSummary {
  site: string | null;
  totalService: number;
  healthyCount: number;
  unhealthyCount: number;
  timestamp: string;
  services: Services[];
}

export interface Services {
  serviceName: string;
  healthy: boolean;
  status: "healthy" | "unhealthy";
  healthUrl: string;
  healthCheck: any;
  issueCodes: string[]
}
