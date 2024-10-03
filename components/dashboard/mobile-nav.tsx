"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import NavLinks from "./nav-links";
import { Menu } from "lucide-react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <SheetTrigger asChild>
        <Button
          variant="link"
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Menu className="xl:hidden" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <SheetClose>
              <div className="flex flex-col space-y-10 mt-10 items-start" onClick={() => setIsOpen(false)}>
                <NavLinks role={data?.user.role as string} />
              </div>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
