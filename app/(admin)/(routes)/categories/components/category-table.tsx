import React from "react";
import { columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { getCategories } from "@/lib/db/queries/admin/categories";

interface CategoryTableProps {
  name: string;
  perPage: string;
  page: string;
  dateFrom: string;
  dateTo: string;
}
const CategoryTable = async ({ name, perPage, page, dateFrom, dateTo }: CategoryTableProps) => {
  const { categoriesData, categoryCount } = await getCategories(name, perPage, page, dateFrom, dateTo);

  return <DataTable columns={columns} data={categoriesData} totalPage={Math.ceil(categoryCount / parseInt(perPage))} />;
};

export default CategoryTable;
