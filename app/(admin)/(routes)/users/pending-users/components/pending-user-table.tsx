import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./Columns";
import { getQueryPendingNewUsers } from "@/lib/db/queries/admin/pendingNewUsers";
import { TQueryPendingNewUserSchema } from "@/lib/validation/pendingNewUserValidation";

const PendingUserTable = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const { count, pendingNewUsersData } = await getQueryPendingNewUsers(searchParams as TQueryPendingNewUserSchema);
  const perPage = (searchParams.perPage as string) || "5";
  const totalPage = Math.ceil(count / parseInt(perPage));

  return <DataTable columns={columns} data={pendingNewUsersData} totalPage={totalPage} filteredCounts={count} perPage={perPage} />;
};

export default PendingUserTable;
