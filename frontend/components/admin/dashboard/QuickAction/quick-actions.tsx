// components/admin/dashboard/QuickAction/quick-actions.tsx
"use client";

import { useState } from "react";
import { Package, Tag, Layers, Truck, Award } from "lucide-react";
import { QuickActionCard } from "./quick-action-card";
import { ActionModal } from "./action-model"; // Pichla wala modal import karo
import type { QuickAction, ModalAction } from "./types";

// Yeh data tumhare dummy data file se aa sakta hai, bas actionType add kar dena
const quickActionsData: QuickAction[] = [
  {
    title: "Add Product",
    description: "Create a new product in inventory",
    icon: Package,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    actionType: "create-product",
    id: "",
    href: ""
  },
  {
    title: "Add Category",
    description: "Organize your products",
    icon: Tag,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    actionType: "create-category",
    id: "",
    href: ""
  },
  {
    title: "Add Variant",
    description: "Create product variations",
    icon: Layers,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    actionType: "create-variant",
    id: "",
    href: ""
  },
  {
    title: "Add Supplier",
    description: "Register new vendor",
    icon: Truck,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    actionType: "create-supplier",
    id: "",
    href: ""
  },
  {
    title: "Add Brand",
    description: "Register a new brand",
    icon: Award,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    actionType: "create-brand",
    id: "",
    href: ""
  },
];

export function QuickActions() {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ModalAction | null>(null);

  const handleActionClick = (action: ModalAction) => {
    setActiveAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveAction(null);
  };

  return (
    <>
      {/* Cards Grid - Mobile pe 2 columns, Desktop pe 2 columns (ya jarurat ke hisab se adjust karo) */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {quickActionsData.map((action) => (
          <QuickActionCard
            key={action.title}
            action={action}
            onClick={handleActionClick}
          />
        ))}
      </div>

      {/* ✅ Yahan Modal Render Hoga */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        action={activeAction}
        onSuccess={() => {
          // Yahan tum apna data refresh kar sakte ho
          // Jaise: mutate() agar React Query use kar rahe ho
          // Ya window.location.reload() (temporary solution)
          console.log("Action successful, refresh data here");
        }}
      />
    </>
  );
}