import { Skeleton } from "../ui/skeleton";

export const SkaletonAdd = () => {
  return (
    <div className="space-y-4 mt-8 p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="w-[300px] h-14" />
      </div>
      <Skeleton className="w-[300px] h-10" />
      <Skeleton className="w-[100px] h-6" />
    </div>
  );
};
