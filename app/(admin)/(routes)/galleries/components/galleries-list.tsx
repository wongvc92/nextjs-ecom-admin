import Image from "next/image";
import React from "react";
import DeleteSingleImage from "./delete-single-image";
import DeleteAllImage from "./delete-all-image";
import { getGalleries } from "@/lib/db/queries/admin/galleries";

interface GalleriesProps {
  page: string;
  published: string;
}
const GalleriesList = async ({ page, published }: GalleriesProps) => {
  const { galleries } = await getGalleries(parseInt(page), published);

  if (!galleries || galleries.length === 0) {
    return <div>No galleries</div>;
  }

  return (
    <>
      <DeleteAllImage galleries={galleries} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-7 gap-4 w-full">
        {galleries.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-md overflow-hidden">
            <Image src={item.url as string} alt={`${item.url}`} fill className="object-cover" />
            {item.published === false && <DeleteSingleImage url={item.url as string} />}
          </div>
        ))}
      </div>
    </>
  );
};

export default GalleriesList;
