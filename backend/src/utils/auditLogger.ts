// utils/auditLogger.js
import { AuditAction, AuditEntityType, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface AuditData {
  adminId?: string | null;
  adminEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName: string;
  oldValue?: Prisma.AuditLogUncheckedCreateInput["oldValue"];
  newValue?: Prisma.AuditLogUncheckedCreateInput["newValue"];
  ipAddress: string;
  userAgent: string;
  metadata?: Prisma.AuditLogUncheckedCreateInput["metadata"];
}

export const logAudit = async (auditData: AuditData) => {
  try {
   
    await prisma.auditLog.create({
      data: {
        adminId: auditData.adminId,
        adminEmail: auditData.adminEmail,
        action: auditData.action,
        entityType: auditData.entityType,
        entityId: auditData.entityId,
        entityName: auditData.entityName,
        oldValue: auditData.oldValue,
        newValue: auditData.newValue,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        metadata: auditData.metadata || {}
      }
    });
  } catch (error) {
  
    console.error("Audit Log Creation Failed:", error);
  }
};