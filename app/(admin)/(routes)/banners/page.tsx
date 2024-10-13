import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Plus } from "lucide-react";

import BannerTable from "./components/banner-table";
import { Suspense } from "react";
import TableLoading from "@/components/loading/table-loading";

export const metadata: Metadata = {
  title: "Banners",
  description: "Manage your Banners",
};

const BannerPage = async ({ searchParams }: { searchParams: { name: string; perPage: string; page: string; dateFrom: string; dateTo: string } }) => {
  const name = searchParams.name || "";
  const perPage = searchParams.perPage || "5";
  const page = searchParams.page || "1";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title={`Banner `} description="Manage banner for your store" />
        <Link href={`banners/add-new`} type="button" className="flex items-center bg-black text-white px-4 py-3 rounded-md text-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Add new</span>
        </Link>
      </div>
      <Suspense fallback={<TableLoading />}>
        <BannerTable perPage={perPage} name={name} page={page} dateFrom={dateFrom} dateTo={dateTo} />
      </Suspense>
    </section>
  );
};

export default BannerPage;
