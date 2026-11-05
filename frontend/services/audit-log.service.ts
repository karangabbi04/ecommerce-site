import { api } from "@/lib/api";

export interface AuditLogEntry {
  id: string;
  adminId: string | null;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata: unknown;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entityType?: string;
  adminId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "timestamp" | "adminEmail" | "action" | "entityType" | "entityName";
  sortOrder?: "asc" | "desc";
}

export const auditLogService = {
  getRecentAuditLogs: async (query?: AuditLogQuery): Promise<AuditLogResponse> => {
    const response = await api.get<{ data: AuditLogResponse }>("/admin/audit-logs", { params: query });
    return response.data.data;
  },
};
