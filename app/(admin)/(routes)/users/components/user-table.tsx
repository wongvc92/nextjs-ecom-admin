import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./Columns";
import { getQueryUsers } from "@/lib/db/queries/admin/users";
import { TQueryUser } from "@/lib/validation/userValidation";

const UserTable = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const { count, usersData } = await getQueryUsers(searchParams as TQueryUser);
  const perPage = (searchParams.perPage as string) || "5";
  const totalPage = Math.ceil(count / parseInt(perPage));

  return <DataTable columns={columns} data={usersData} totalPage={totalPage} filteredCounts={count} perPage={perPage} />;
};

export default UserTable;
