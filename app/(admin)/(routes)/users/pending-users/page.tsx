import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import FiltersLoading from "@/components/loading/filters-loading";
import StatsLoading from "@/components/loading/stats-loading";
import TableLoading from "@/components/loading/table-loading";
import PendingUserTable from "./components/pending-user-table";
import PendingUserStats from "./components/pending-user-stats";
import { PendingUserFilters } from "./components/pending-user-filters";

const PendingUsersPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Pending Users" description="Manage pending users for your store" />
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<StatsLoading />}>
        <PendingUserStats />
      </Suspense>
      <Suspense fallback={<FiltersLoading />}>
        <PendingUserFilters />
      </Suspense>
      <Suspense fallback={<TableLoading />}>
        <PendingUserTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default PendingUsersPage;
