"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ROUTES = [
  {
    label: "Sender",
    path: "/shippings/sender",
  },
  {
    label: "Webhook",
    path: "/shippings/webhook",
  },
] as const;

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex border-b text-sm">
      {ROUTES.map((route) => (
        <Link
          key={route.label}
          href={route.path}
          className={`pb-2 px-4 -mb-px ${
            pathname.startsWith(route.path) ? "border-b-2 border-primary text-primary" : "border-b-2 border-transparent hover:border-muted-foreground"
          }`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
