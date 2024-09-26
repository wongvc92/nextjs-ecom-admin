import React from "react";
import { Skeleton } from "../ui/skeleton";

const StatsLoading = () => {
  const rows = Array.from({ length: 6 });
  return (
    <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
      {rows.map((_, i) => (
        <Skeleton
          key={i}
          className="border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1"
        ></Skeleton>
      ))}
    </div>
  );
};

export default StatsLoading;
