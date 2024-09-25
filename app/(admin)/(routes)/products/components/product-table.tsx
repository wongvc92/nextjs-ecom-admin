import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./Columns";
import { getProducts } from "@/lib/db/queries/admin/products";

const ProductTable = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const name = (searchParams.name as string) || "";
  const page = (searchParams.page as string) || "1";
  const dateFrom = (searchParams.dateFrom as string) || "";
  const dateTo = (searchParams.dateTo as string) || "";
  const isArchived = searchParams.isArchived || "";
  const isFeatured = searchParams.isFeatured || "";
  const category = searchParams.category || "";
  const isOutOfStock = (searchParams.isOutOfStock as string) || "";
  const perPage = (searchParams.perPage as string) || "5";

  const { filteredCount, products } = await getProducts(name, perPage, page, dateFrom, dateTo, isArchived, isFeatured, category, isOutOfStock);

  const totalPage = Math.ceil(filteredCount / parseInt(perPage));
  return <DataTable columns={columns} data={products} totalPage={totalPage} />;
};

export default ProductTable;
