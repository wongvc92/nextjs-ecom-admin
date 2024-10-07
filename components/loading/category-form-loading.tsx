import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const CategoryFormLoading = () => {
  return (
    <div className="px-4 space-y-4 py-8">
      <div className="flex items-center justify-between w-full ">
        <Skeleton className="w-20 h-10" />
        <Skeleton className="w-10 h-10" />
      </div>
      <Skeleton className="w-28 h-10" />
      <Separator />
      <div className="space-y-8 w-full">
        <div className="w-full md:grid lg:grid-cols-3 gap-8">
          <Skeleton className="w-30 h-10" />
        </div>
        <Skeleton className="w-full md:w-28 h-10" />
      </div>
    </div>
  );
};

export default CategoryFormLoading;
