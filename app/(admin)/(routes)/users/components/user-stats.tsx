import { getpendingNewUserStatsCount } from "@/lib/db/queries/admin/pendingNewUsers";
import { getUserStatsCount } from "@/lib/db/queries/admin/users";
import Link from "next/link";
import React, { cache } from "react";

const getCachedUserStatsCount = cache(async () => {
  return await getUserStatsCount();
});

const getCachedpendingUserStatsCount = cache(async () => {
  return await getpendingNewUserStatsCount();
});

const UserStats = async () => {
  const { allUsersCount, blockedUsersCount, totalAdminRoleCount, totalUserRoleCount } = await getCachedUserStatsCount();
  const { allPendingUsersCount } = await getCachedpendingUserStatsCount();
  const USER_STATS = [
    {
      id: 1,
      label: "Total",
      count: allUsersCount ?? 0,
      url: "/users?page=1&perPage=5",
    },
    {
      id: 2,
      label: "Admin",
      count: totalAdminRoleCount ?? 0,
      url: "/users?page=1&perPage=5&role=ADMIN",
    },
    {
      id: 3,
      label: "User",
      count: totalUserRoleCount ?? 0,
      url: "/users?page=1&perPage=5&role=USER",
    },
    {
      id: 4,
      label: "Blocked",
      count: blockedUsersCount,
      url: "/users?page=1&perPage=5&isBlocked=TRUE",
    },
    {
      id: 5,
      label: "Pending",
      count: allPendingUsersCount,
      url: "/users/pending-users?page=1&perPage=5",
    },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
        {USER_STATS.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1 ${
              item.count === 0 && "pointer-events-none"
            }`}
          >
            <p className="text-muted-foreground text-center text-xl font-bold">{item.count}</p>
            <p className="text-center font-light">{item.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default UserStats;
