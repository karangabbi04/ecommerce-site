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

// components/modals/types.ts

export type ModalAction = 
  | "create-category" 
  | "create-product" 
  | "edit-product"
  | "create-variant" 
  | "create-supplier" 
  | "create-brand";

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // e.g., "bg-blue-100 text-blue-600"
  actionType: ModalAction; // <-- Yeh add kiya (href ki jagah)
}

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ModalAction | null;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export interface FormProps {
  onSuccess?: () => void;
  onClose: () => void;
}