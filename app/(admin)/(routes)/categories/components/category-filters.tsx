import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import React from "react";
import NameFilter from "./name-filter";
import ClearFilters from "./clear-filters";

const CategoryFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DatePickerWithRange title="Created" dateFromParams="dateFrom" dateToParams="dateTo" />
      <NameFilter />
      <ClearFilters />
    </div>
  );
};

export default CategoryFilters;
