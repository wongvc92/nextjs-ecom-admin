import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import NameFilter from "./name-filter";
import ClearFilters from "./clear-filters";
import EmailFilter from "./email-filter";

export const UserFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DatePickerWithRange title="Verified" dateFromParams="dateFrom" dateToParams="dateTo" />
      <NameFilter />
      <EmailFilter />
      <ClearFilters />
    </div>
  );
};
