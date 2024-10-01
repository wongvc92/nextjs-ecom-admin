import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import NameFilter from "./name-filter";
import IsArchivedFilter from "./isArchived-filter";
import IsFeaturedFilter from "./isFeatured-filter";
import CategoryFilter from "./category-filter";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";
import ClearFilters from "./clear-filters";
import { cache } from "react";

const getCachedDistinctCategories = cache(async () => {
  return await getDistinctCategories();
});
export const ProductFilters = async () => {
  const distinctCategories = await getCachedDistinctCategories();

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DatePickerWithRange title="Created" dateFromParams="dateFrom" dateToParams="dateTo" />
      <NameFilter />
      <IsArchivedFilter />
      <IsFeaturedFilter />
      <CategoryFilter distinctCategories={distinctCategories} />
      <ClearFilters />
    </div>
  );
};
