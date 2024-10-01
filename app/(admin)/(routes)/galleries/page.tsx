import React, { Suspense } from "react";
import Galleries from "./components/galleries-list";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import StatsLoading from "@/components/loading/stats-loading";
import FiltersLoading from "@/components/loading/filters-loading";
import GalleryStats from "./components/gallery-stats";
import GalleryFilters from "./components/gallery-filters";
import GalleryPagination from "./components/gallery-pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galleries",
  description: "Manage galleries for your store",
};

export const dynamic = "force-dynamic";

const GalleriesPage = async ({ searchParams }: { searchParams: { page: string; published: string } }) => {
  const page = searchParams.page || "1";
  const published = searchParams.published;

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Galleries" description="Manage galleries for your store" />
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<StatsLoading />}>
        <GalleryStats />
      </Suspense>
      <Suspense fallback={<FiltersLoading />}>
        <GalleryFilters />
      </Suspense>
      <Suspense fallback={<StatsLoading />}>
        <Galleries page={page} published={published} />
      </Suspense>
      <Suspense fallback={<div className="flex justify-center">loading...</div>}>
        <GalleryPagination page={page} published={published} />
      </Suspense>
    </section>
  );
};

export default GalleriesPage;
