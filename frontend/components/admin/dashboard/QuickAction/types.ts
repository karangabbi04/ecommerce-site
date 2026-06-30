import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  disabled?: boolean;
  badge?: string;
  permission?: string;
}