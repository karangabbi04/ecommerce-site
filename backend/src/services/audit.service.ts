import { AuditAction, AuditEntityType, Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../lib/prisma.js";

const SORT_FIELDS = ["timestamp", "adminEmail", "action", "entityType", "entityName"] as const;
type AuditSortField = (typeof SORT_FIELDS)[number];
type QueryParams = Record<string, unknown>;

function queryString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parsePositiveInteger(value: unknown, fallback: number, name: string, maximum?: number) {
  const rawValue = queryString(value);
  if (!rawValue) return fallback;
  if (!/^\d+$/.test(rawValue)) {
    throw new ApiError(400, `${name} must be a positive integer`);
  }

  const parsedValue = Number(rawValue);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1 || (maximum && parsedValue > maximum)) {
    throw new ApiError(400, `${name} must be between 1 and ${maximum ?? Number.MAX_SAFE_INTEGER}`);
  }
  return parsedValue;
}

function parseEnumList<T extends string>(value: unknown, allowedValues: readonly T[], name: string): T[] {
  const rawValue = queryString(value);
  if (!rawValue) return [];

  const values = rawValue.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean);
  const invalidValues = values.filter((item) => !allowedValues.includes(item as T));
  if (invalidValues.length) {
    throw new ApiError(400, `Invalid ${name}: ${invalidValues.join(", ")}`);
  }
  return [...new Set(values)] as T[];
}

function parseDate(value: unknown, name: string, endOfDay = false): Date | undefined {
  const rawValue = queryString(value);
  if (!rawValue) return undefined;

  const normalizedValue = endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
    ? `${rawValue}T23:59:59.999Z`
    : rawValue;
  const date = new Date(normalizedValue);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${name} must be a valid date`);
  }
  return date;
}

export const getAuditLogs = async (query: QueryParams) => {
  const page = parsePositiveInteger(query.page, 1, "page");
  const limit = parsePositiveInteger(query.limit, 50, "limit", 100);
  const search = queryString(query.search);
  const actions = parseEnumList(query.action, Object.values(AuditAction), "action");
  const entityTypes = parseEnumList(query.entityType, Object.values(AuditEntityType), "entityType");
  const adminId = queryString(query.adminId);
  const dateFrom = parseDate(query.dateFrom, "dateFrom");
  const dateTo = parseDate(query.dateTo, "dateTo", true);

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new ApiError(400, "dateFrom must be earlier than or equal to dateTo");
  }

  const sortByValue = queryString(query.sortBy) || "timestamp";
  if (!SORT_FIELDS.includes(sortByValue as AuditSortField)) {
    throw new ApiError(400, `sortBy must be one of: ${SORT_FIELDS.join(", ")}`);
  }
  const sortBy = sortByValue as AuditSortField;
  const sortOrderValue = queryString(query.sortOrder).toLowerCase() || "desc";
  if (sortOrderValue !== "asc" && sortOrderValue !== "desc") {
    throw new ApiError(400, "sortOrder must be asc or desc");
  }

  const where: Prisma.AuditLogWhereInput = {};
  if (actions.length) where.action = { in: actions };
  if (entityTypes.length) where.entityType = { in: entityTypes };
  if (adminId) where.adminId = adminId;
  if (dateFrom || dateTo) {
    where.timestamp = {
      ...(dateFrom ? { gte: dateFrom } : {}),
      ...(dateTo ? { lte: dateTo } : {}),
    };
  }
  if (search) {
    where.OR = [
      { adminEmail: { contains: search, mode: "insensitive" } },
      { entityName: { contains: search, mode: "insensitive" } },
      { entityId: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      orderBy: { [sortBy]: sortOrderValue },
      skip,
      take: limit,
      select: {
        id: true,
        adminId: true,
        adminEmail: true,
        action: true,
        entityType: true,
        entityId: true,
        entityName: true,
        oldValue: true,
        newValue: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
        metadata: true,
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
