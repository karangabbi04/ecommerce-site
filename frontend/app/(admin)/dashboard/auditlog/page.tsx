"use client";

import { useMemo, useState } from "react";
import {
    Activity,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    Search,
    X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type ColumnConfig } from "@/components/data-table/DataTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecentAuditLogs } from "@/hooks/queries/use-audit-logs";
import type { AuditLogEntry, AuditLogQuery } from "@/services/audit-log.service";

interface FilterState {
    search: string;
    datePreset: "all" | "today" | "weekly" | "monthly";
    action: string;
    entityType: string;
}

function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatAuditValue(value: unknown) {
    if (value === null || value === undefined) return "Not recorded";
    if (typeof value === "string") return value;

    try {
        return JSON.stringify(value, null, 2) ?? String(value);
    } catch {
        return String(value);
    }
}

function getAuditValueEntries(value: unknown): [string, unknown][] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.map((item, index) => [String(index), item]);
    if (typeof value === "object") return Object.entries(value);
    return [["Value", value]];
}

function AuditChangesDialog({ row }: { row: AuditLogEntry }) {
    const beforeValues = new Map(getAuditValueEntries(row.oldValue));
    const afterValues = new Map(getAuditValueEntries(row.newValue));
    const fieldNames = [...new Set([...beforeValues.keys(), ...afterValues.keys()])];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Eye className="size-4" aria-hidden="true" />
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Changes to {row.entityName}</DialogTitle>
                    <DialogDescription>
                        {row.action.replaceAll("_", " ")} {row.entityType.toLowerCase()} · {new Date(row.timestamp).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>

                {fieldNames.length ? (
                    <div className="overflow-hidden rounded-md border">
                        <div className="grid grid-cols-[minmax(5rem,0.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            <span>Field</span>
                            <span>Before</span>
                            <span>After</span>
                        </div>
                        <div className="divide-y">
                            {fieldNames.map((fieldName) => (
                                <div key={fieldName} className="grid grid-cols-[minmax(5rem,0.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 px-3 py-3 text-sm">
                                    <span className="wrap-break-word font-medium">{fieldName}</span>
                                    <span className="max-h-28 overflow-auto whitespace-pre-wrap wrap-break-word text-muted-foreground">
                                        {formatAuditValue(beforeValues.get(fieldName))}
                                    </span>
                                    <span className="max-h-28 overflow-auto whitespace-pre-wrap wrap-break-word">
                                        {formatAuditValue(afterValues.get(fieldName))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="rounded-md border p-4 text-sm text-muted-foreground">No before/after values were recorded.</p>
                )}

                {row.metadata !== null && row.metadata !== undefined && (
                    <details className="rounded-md border px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium">Additional details</summary>
                        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap wrap-break-word rounded bg-muted p-3 text-xs">
                            {formatAuditValue(row.metadata)}
                        </pre>
                    </details>
                )}
            </DialogContent>
        </Dialog>
    );
}

const columns: ColumnConfig<AuditLogEntry>[] = [
    {
        header: "Time",
        cell: (row) => (
            <span className="whitespace-nowrap text-sm">
                {new Date(row.timestamp).toLocaleString()}
            </span>
        ),
    },
    {
        header: "Admin",
        cell: (row) => <span className="font-medium">{row.adminEmail}</span>,
    },
    {
        header: "Action",
        cell: (row) => {
            const variant = row.action === "DELETE"
                ? "destructive"
                : row.action === "CREATE"
                    ? "default"
                    : "secondary";

            return <Badge variant={variant}>{row.action.replaceAll("_", " ")}</Badge>;
        },
    },
    {
        header: "Entity",
        cell: (row) => (
            <div className="min-w-36 space-y-1">
                <Badge variant="outline">{row.entityType}</Badge>
                <p className="font-medium">{row.entityName}</p>
                <p className="font-mono text-xs text-muted-foreground">{row.entityId}</p>
            </div>
        ),
    },
    {
        header: "Changes",
        cell: (row) => <AuditChangesDialog row={row} />,
    },
];

export default function AuditLogPage() {
    const [page, setPage] = useState(1);
    const limit = 20;
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        datePreset: "all",
        action: "ALL",
        entityType: "ALL",
    });
    const debouncedSearch = useDebounce(filters.search, 400);

    const query = useMemo<AuditLogQuery>(() => {
        const params: AuditLogQuery = {
            page,
            limit,
            search: debouncedSearch || undefined,
            action: filters.action !== "ALL" ? filters.action : undefined,
            entityType: filters.entityType !== "ALL" ? filters.entityType : undefined,
            sortBy: "timestamp",
            sortOrder: "desc",
        };

        if (filters.datePreset !== "all") {
            const today = new Date();
            const from = new Date(today);

            if (filters.datePreset === "weekly") from.setDate(today.getDate() - 6);
            if (filters.datePreset === "monthly") from.setDate(today.getDate() - 29);

            params.dateFrom = formatLocalDate(from);
            params.dateTo = formatLocalDate(today);
        }

        return params;
    }, [page, limit, debouncedSearch, filters.datePreset, filters.action, filters.entityType]);

    const auditQuery = useRecentAuditLogs(query);
    const logs = auditQuery.data?.logs ?? [];
    const pagination = auditQuery.data?.pagination;
    const totalPages = Math.max(1, pagination?.totalPages ?? 1);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((current) => ({ ...current, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ search: "", datePreset: "all", action: "ALL", entityType: "ALL" });
        setPage(1);
    };

    const hasActiveFilters =
        filters.search || filters.datePreset !== "all" || filters.action !== "ALL" || filters.entityType !== "ALL";

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 p-3 md:p-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                        <Activity className="size-6 text-primary" aria-hidden="true" />
                        Audit Logs
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review admin actions and changes across the store.
                    </p>
                </div>
                <Badge variant="outline" className="w-fit">
                    {pagination?.total ?? 0} records
                </Badge>
            </header>

            <Card className="border-dashed">
                <CardContent className="p-3 md:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-sm font-semibold">
                            <Filter className="size-4" aria-hidden="true" /> Filters
                        </h2>
                        {hasActiveFilters && (
                            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="size-3.5" aria-hidden="true" />
                                Clear filters
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            <Input
                                value={filters.search}
                                onChange={(event) => handleFilterChange("search", event.target.value)}
                                placeholder="Search admin or entity..."
                                aria-label="Search audit logs"
                                className="h-10 pl-9"
                            />
                        </div>

                        <Select value={filters.datePreset} onValueChange={(value: FilterState["datePreset"]) => handleFilterChange("datePreset", value)}>
                            <SelectTrigger className="h-10 w-full">
                                <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                                <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="weekly">Last 7 days</SelectItem>
                                <SelectItem value="monthly">Last 30 days</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All actions</SelectItem>
                                <SelectItem value="CREATE">Created</SelectItem>
                                <SelectItem value="UPDATE">Updated</SelectItem>
                                <SelectItem value="DELETE">Deleted</SelectItem>
                                <SelectItem value="STATUS_CHANGE">Status changed</SelectItem>
                                <SelectItem value="LOGIN">Login</SelectItem>
                                <SelectItem value="LOGOUT">Logout</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.entityType} onValueChange={(value) => handleFilterChange("entityType", value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All entity types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All entity types</SelectItem>
                                <SelectItem value="PRODUCT">Product</SelectItem>
                                <SelectItem value="ORDER">Order</SelectItem>
                                <SelectItem value="CATEGORY">Category</SelectItem>
                                <SelectItem value="COUPON">Coupon</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {auditQuery.isLoading ? (
                <div className="rounded-md border bg-background p-10 text-center text-sm text-muted-foreground">
                    Loading audit logs...
                </div>
            ) : auditQuery.isError ? (
                <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
                    {auditQuery.error instanceof Error ? auditQuery.error.message : "Could not load audit logs."}
                </div>
            ) : (
                <section className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Showing {logs.length} of {pagination?.total ?? 0} audit records
                    </p>

                    {logs.length ? (
                        <DataTable
                            data={logs}
                            columns={columns}
                            scrollable
                            getRowId={(row) => row.id}
                        />
                    ) : (
                        <div className="rounded-md border bg-background p-10 text-center text-sm text-muted-foreground">
                            No audit records match these filters.
                        </div>
                    )}

                    <div className="flex flex-col gap-3 rounded-md border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination?.page ?? page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={page <= 1 || auditQuery.isFetching}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                            >
                                <ChevronLeft className="size-4" aria-hidden="true" /> Previous
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages || auditQuery.isFetching}
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                            >
                                Next <ChevronRight className="size-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
