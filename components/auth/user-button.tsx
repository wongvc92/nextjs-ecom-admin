"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, SettingsIcon } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";
import SignOutButton from "./sign-out-button";
import { SignInButton } from "./sign-in-button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UserButton = () => {
  const { data } = useSession();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:block">
        {data?.user.image ? <Image src={data.user.image} alt="user Image" height={40} width={40} className="rounded-full" /> : <CircleUserRound />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/settings")}>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{data?.user ? <SignOutButton /> : <SignInButton />}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
