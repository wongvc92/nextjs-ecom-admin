import React from "react";
import { columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { getBannerImages } from "@/lib/db/queries/admin/banners";

interface BannerTableProps {
  name: string;
  perPage: string;
  page: string;
  dateFrom: string;
  dateTo: string;
}
const BannerTable = async ({ name, perPage, page, dateFrom, dateTo }: BannerTableProps) => {
  const data = await getBannerImages();

  return <DataTable columns={columns} data={data} totalPage={Math.ceil(data.length / parseInt(perPage))} />;
};

export default BannerTable;
