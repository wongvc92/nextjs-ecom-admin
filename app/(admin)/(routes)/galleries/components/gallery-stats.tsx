import { getGalleryStatsCount } from "@/lib/db/queries/admin/galleries";
import Link from "next/link";
import React, { cache } from "react";

const getCachedGalleryStatsCount = cache(async () => {
  return await getGalleryStatsCount();
});

const GalleryStats = async () => {
  const { allGalleryCount, publisedGalleryCount, unpublisedGalleryCount } = await getCachedGalleryStatsCount();
  const GALLERY_STATS = [
    {
      id: 1,
      label: "Total",
      count: allGalleryCount ?? 0,
      url: "/galleries?page=1&perPage=5",
    },
    {
      id: 2,
      label: "Published",
      count: publisedGalleryCount ?? 0,
      url: "/galleries?page=1&perPage=5&published=TRUE",
    },
    {
      id: 3,
      label: "Unpublished",
      count: unpublisedGalleryCount ?? 0,
      url: "/galleries?page=1&perPage=5&published=FALSE",
    },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
        {GALLERY_STATS.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className="border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1"
          >
            <p className="text-muted-foreground text-center text-xl font-bold">{item.count}</p>
            <p className="text-center font-light">{item.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default GalleryStats;
