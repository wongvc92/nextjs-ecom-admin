import { Skeleton } from "../ui/skeleton";

export const SkaletonTable = () => {
  return (
    <div className="space-y-4 mt-8 p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="w-[300px] h-14" />
        <Skeleton className="w-[150px] h-10" />
      </div>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-44" />
    </div>
  );
};
