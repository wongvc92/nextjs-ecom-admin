import { Skeleton } from "../ui/skeleton";

const FiltersLoading = () => {
  const rows = Array.from({ length: 6 });

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {rows.map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full"></Skeleton>
      ))}
    </div>
  );
};

export default FiltersLoading;
