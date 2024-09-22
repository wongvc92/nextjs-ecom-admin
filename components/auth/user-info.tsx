import React from "react";

import { ExtendedUser } from "@/@types/next-auth";
import { Badge } from "../ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}
const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <div className="max-w-md mx-auto ">
      <div className="flex flex-col gap-4 px-4">
        <p>{label}</p>
        <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
          <p>ID</p>
          <p className="truncate bg-muted p-1 rounded-md">{user?.id}</p>
        </div>
        <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
          <p>Name</p>
          <p className="truncate bg-muted p-1 rounded-md">{user?.name}</p>
        </div>
        <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
          <p>Email</p>
          <p className="truncate bg-muted p-1 rounded-md">{user?.email}</p>
        </div>
        <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
          <p>Role</p>
          <p className="truncate bg-muted p-1 rounded-md">{user?.role}</p>
        </div>
        <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
          <p>Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>{user?.isTwoFactorEnabled ? "ON" : "OFF"}</Badge>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
