import { getpendingNewUserStatsCount } from "@/lib/db/queries/admin/pendingNewUsers";

import Link from "next/link";
import React, { cache } from "react";

const getCachedpendingUserStatsCount = cache(async () => {
  return await getpendingNewUserStatsCount();
});
const PendingUserStats = async () => {
  const { allPendingUsersCount } = await getCachedpendingUserStatsCount();
  const PENDING_USER_STATS = [
    {
      id: 1,
      label: "Total",
      count: allPendingUsersCount ?? 0,
      url: "/pending-users?page=1&perPage=5",
    },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
        {PENDING_USER_STATS.map((item) => (
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

export default PendingUserStats;
