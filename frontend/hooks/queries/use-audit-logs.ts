import { useQuery } from "@tanstack/react-query";
import { auditLogService, type AuditLogQuery } from "@/services/audit-log.service";

export function useRecentAuditLogs(query?: AuditLogQuery) {
  return useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () => auditLogService.getRecentAuditLogs(query),
  });
}
