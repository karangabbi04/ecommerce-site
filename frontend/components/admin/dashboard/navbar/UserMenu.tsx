"use client";

import Image from "next/image";
import Link from "next/link";


import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  User,
  Settings,
  CreditCard,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react";

type UserMenuProps = {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

const defaultUser = {
  name: "Karan Singh",
  email: "karan@example.com",
  avatar: "https://res.cloudinary.com/dug5p4xso/image/upload/v1777551259/ecocraft/products/dbf4wsa1ybrsia2j8hit.jpg",
};

export default function UserMenu({
  user = defaultUser,
}: UserMenuProps) {
  return (

     

        <button
          className="
          flex
          items-center
          border
          bg-background
          w-[50px]
          h-[50px]
          transition-all
          duration-200
          hover:bg-muted
          outline-none
          rounded-full
          overflow-hidden
        "
        >
          <div className="relative">

            <Image
              src={user.avatar}
              alt={user.name}
              width={50}
              height={30}
            />
          </div>
        </button>

    




  );
}

type MenuItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
