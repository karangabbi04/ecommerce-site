// components/admin/BulkActionBar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdate: (newStatus: string) => Promise<void>;
}

export function BulkActionBar({ selectedCount, onClearSelection, onBulkUpdate }: BulkActionBarProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async () => {
    if (!newStatus) return;
    setIsUpdating(true);
    setErrorMessage("");
    try {
      await onBulkUpdate(newStatus);
      setNewStatus("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update selected orders."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-800">
          {selectedCount} Order{selectedCount > 1 ? 's' : ''} Selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onClearSelection();
            setErrorMessage("");
            setNewStatus("");
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={newStatus} onValueChange={setNewStatus} disabled={isUpdating}>
          <SelectTrigger className="w-45 bg-white">
            <SelectValue placeholder="Change status to..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PACKED">Packed</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="OUT_FOR_DELIVERY">Out for delivery</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleUpdate} 
          disabled={!newStatus || isUpdating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update All
        </Button>
      </div>

      {errorMessage && (
        <p role="alert" className="basis-full text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}