"use client";

import { UserRoleEnum } from "@/@types/next-auth";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
}
const RoleGate = ({ children }: RoleGateProps) => {
  const { data } = useSession();

  if (data?.user?.role !== "ADMIN") {
    return <div>You do not have permission to view this content!</div>;
  }
  return <div>{children}</div>;
};

export default RoleGate;
