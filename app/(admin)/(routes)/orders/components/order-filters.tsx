import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import NameFilter from "./name-filter";
import StatusFilter from "./status-filter";
import ClearFilters from "./clear-filters";

export const OrderFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DatePickerWithRange title="Created" dateFromParams="dateFrom" dateToParams="dateTo" />
      <StatusFilter />
      <NameFilter />
      <ClearFilters />
    </div>
  );
};
