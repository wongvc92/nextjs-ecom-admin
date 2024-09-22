import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import NavIcon from "./nav-icon";

interface NavLinkProps {
  item: { name: string; path: string };
  isActive: boolean;
}
const NavLink: React.FC<NavLinkProps> = ({ item, isActive }) => {
  return (
    <nav>
      <Link
        href={item.path}
        className={cn(
          "text-sm text-muted-foreground px-2 py-2 flex gap-2 items-center hover:bg-muted hover:rounded-sm font-normal dark:text-white lg:w-[150px]",
          isActive && "text-secondary-foreground bg-accent px-2 py-2 rounded-sm"
        )}
      >
        <NavIcon name={item.name} />
        <span className=" hidden lg:flex">{item.name}</span>
      </Link>
    </nav>
  );
};

export default NavLink;
