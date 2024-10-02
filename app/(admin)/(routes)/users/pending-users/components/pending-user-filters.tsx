import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import ClearFilters from "./clear-filters";
import EmailFilter from "./email-filter";

export const PendingUserFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DatePickerWithRange title="Created" dateFromParams="dateFrom" dateToParams="dateTo" />
      <EmailFilter />
      <ClearFilters />
    </div>
  );
};
