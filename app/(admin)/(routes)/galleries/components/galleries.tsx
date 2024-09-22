import Image from "next/image";
import React from "react";
import Sort from "./published-filter";
import DeleteSingleImage from "./delete-single-image";
import DeleteAllImage from "./delete-all-image";
import GroupPagination from "@/components/group-pagination";
import { Heading } from "@/components/ui/heading";
import { Gallery } from "@/lib/db/schema/galleries";
import GalleryStats from "./gallery-stats";

interface GalleriesProps {
  galleries?: Gallery[] | null;
  totalPages: number;
  allGalleryCount: number;
  publisedGalleryCount: number;
  unpublisedGalleryCount: number;
}
const Galleries: React.FC<GalleriesProps> = ({ galleries, totalPages, allGalleryCount, publisedGalleryCount, unpublisedGalleryCount }) => {
  return (
    <section className="w-full md:container min-h-screen ">
      <div className="py-8 px-4 flex-col space-y-4 w-full">
        <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
          <Heading title="Galleries" description="Manage galleries for your store" />
          <DeleteAllImage galleries={galleries} />
        </div>
        <GalleryStats allGalleryCount={allGalleryCount} publisedGalleryCount={publisedGalleryCount} unpublisedGalleryCount={unpublisedGalleryCount} />
        <div className="flex items-center justify-between">
          <Sort />
        </div>
        {!galleries || galleries.length === 0 ? (
          <div>No galleries</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-4 w-full">
            {galleries.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-md overflow-hidden">
                <Image src={item.url as string} alt={`${item.url}`} fill className="object-cover" />
                {item.published === false && <DeleteSingleImage url={item.url as string} />}
              </div>
            ))}
          </div>
        )}
      </div>
      <GroupPagination totalPages={totalPages} />
    </section>
  );
};

export default Galleries;
