"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Box, GalleryHorizontal, ImageIcon, LayoutDashboard, Menu, ShoppingCart, StretchHorizontal, UsersRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export const routes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Banners",
    path: "/banners",
    icon: GalleryHorizontal,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: StretchHorizontal,
  },
  {
    name: "Products",
    path: "/products",
    icon: Box,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Galleries",
    path: "/galleries",
    icon: ImageIcon,
  },
  {
    name: "Users",
    path: "/users",
    icon: UsersRound,
  },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const roleBasedRoute =
    data?.user.role === "USER"
      ? routes.filter((route) => {
          return route.name !== "Users";
        })
      : routes;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="link">
          <Menu className="xl:hidden" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <SheetClose>
              <div className="flex flex-col space-y-10 mt-10 items-start" onClick={() => setOpen(false)}>
                <ul className={cn("flex flex-col items-start space-y-12 mt-12 px-2 py-2 w-full")}>
                  {roleBasedRoute.map((item, i) => (
                    <li key={item.name} onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                      <Link
                        href={item.path}
                        className="flex items-center gap-2 w-full h-8 group text-muted-foreground hover:bg-muted hover:w-full p-2 rounded-sm dark:hover:bg-white dark:hover:text-black font-normal"
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
