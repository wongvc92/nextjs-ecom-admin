import GroupPagination from "@/components/group-pagination";
import { getGalleries } from "@/lib/db/queries/admin/galleries";

interface GalleryPaginationProps {
  page: string;
  published: string;
}

const GalleryPagination = async ({ page, published }: GalleryPaginationProps) => {
  const { galleryCount, perPage } = await getGalleries(parseInt(page), published);
  const totalPages = Math.ceil(galleryCount / perPage);

  return <GroupPagination totalPages={totalPages} />;
};

export default GalleryPagination;
