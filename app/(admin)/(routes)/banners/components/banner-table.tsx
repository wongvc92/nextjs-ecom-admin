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
  const { banner, filteredCounts } = await getBannerImages({ perPage, page });

  return (
    <DataTable
      columns={columns}
      data={banner}
      totalPage={Math.ceil(banner.length / parseInt(perPage))}
      filteredCounts={filteredCounts}
      perPage={perPage}
    />
  );
};

export default BannerTable;
