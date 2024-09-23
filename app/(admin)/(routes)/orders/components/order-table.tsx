import { DataTable } from "@/components/ui/data-table";
import { getOrders } from "@/lib/db/queries/admin/orders";
import { TOrdersQuery } from "@/lib/validation/orderValidation";
import React from "react";
import { columns } from "./Columns";

const OrderTable = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const { ordersData, orderCount } = await getOrders(searchParams as TOrdersQuery);
  const perPage = (searchParams.perPage as string) || "5";
  const totalPage = Math.ceil(orderCount / parseInt(perPage));

  return <DataTable columns={columns} data={ordersData} totalPage={totalPage} />;
};

export default OrderTable;
