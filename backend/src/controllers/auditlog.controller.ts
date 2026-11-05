import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { getAuditLogs } from "../services/audit.service.js";
import { ApiError } from "../utils/apiError.js";
import { AuditAction, AuditEntityType } from "@prisma/client";
import { z } from "zod";

const enumListQuery = (values: readonly string[]) =>
  z.string().trim().max(200).refine((value) => {
    const items = value.split(",").map((item) => item.trim().toUpperCase());
    return items.every((item) => values.includes(item));
  }, "Contains an invalid value").optional();

const dateQuery = z.string().trim().min(1).max(40).refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Must be a valid date",
).optional();

const auditLogQuerySchema = z.object({
  page: z.string().regex(/^[1-9]\d{0,8}$/, "page must be a positive integer").optional(),
  limit: z.string().regex(/^[1-9]\d{0,2}$/, "limit must be between 1 and 100")
    .refine((value) => Number(value) <= 100, "limit must be between 1 and 100")
    .optional(),
  search: z.string().trim().max(100, "search must be at most 100 characters").optional(),
  action: enumListQuery(Object.values(AuditAction)),
  entityType: enumListQuery(Object.values(AuditEntityType)),
  adminId: z.string().uuid("adminId must be a valid ID").optional(),
  dateFrom: dateQuery,
  dateTo: dateQuery,
  sortBy: z.enum(["timestamp", "adminEmail", "action", "entityType", "entityName"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
}).strict().superRefine((query, context) => {
  if (query.dateFrom && query.dateTo && new Date(query.dateFrom) > new Date(query.dateTo)) {
    context.addIssue({
      code: "custom",
      path: ["dateFrom"],
      message: "dateFrom must be earlier than or equal to dateTo",
    });
  }
});





export const recentAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const validation = auditLogQuerySchema.safeParse(req.query);
  if (!validation.success) {
    throw new ApiError(400, "Invalid audit log query", validation.error.issues);
  }

  const result = await getAuditLogs(validation.data);

  res.status(200).json(
    new ApiResponse(200, result, "Audit logs fetched successfully"),
  );
});