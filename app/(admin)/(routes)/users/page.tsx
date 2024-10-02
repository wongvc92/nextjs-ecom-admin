import FiltersLoading from "@/components/loading/filters-loading";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { Suspense } from "react";
import TableLoading from "@/components/loading/table-loading";
import StatsLoading from "@/components/loading/stats-loading";
import UserTable from "./components/user-table";
import UserStats from "./components/user-stats";
import { UserFilters } from "./components/user-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const UsersPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Users" description="Manage users for your store" />
        <Link href="/users/add-new">
          <Button type="button" className="flex items-center">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Add new</span>
          </Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<StatsLoading />}>
        <UserStats />
      </Suspense>
      <Suspense fallback={<FiltersLoading />}>
        <UserFilters />
      </Suspense>
      <Suspense fallback={<TableLoading />}>
        <UserTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default UsersPage;
