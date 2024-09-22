import React from "react";
import Galleries from "./components/galleries";
import { getGalleries, getOrderStatsCount } from "@/lib/db/queries/admin/galleries";

const GalleriesPage = async ({ searchParams }: { searchParams: { page: string; published: string } }) => {
  const page = searchParams.page || "1";
  const published = searchParams.published;

  const { galleries, galleryCount, perPage } = await getGalleries(parseInt(page), published);
  const { allGalleryCount, publisedGalleryCount, unpublisedGalleryCount } = await getOrderStatsCount();
  return (
    <Galleries
      galleries={galleries}
      totalPages={Math.ceil(galleryCount / perPage)}
      allGalleryCount={allGalleryCount}
      publisedGalleryCount={publisedGalleryCount}
      unpublisedGalleryCount={unpublisedGalleryCount}
    />
  );
};

export default GalleriesPage;
