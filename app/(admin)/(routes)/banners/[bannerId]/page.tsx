import { Metadata } from "next";
import EditForm from "./edit-form";
import { getBannerImageById } from "@/lib/db/queries/admin/banners";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Edit Banner",
  description: "Manage your Banners",
};

const getCachedImageById = cache(async (bannerId: string) => {
  return await getBannerImageById(bannerId);
});

const EditBannerPage = async ({ params }: { params: { bannerId: string } }) => {
  const bannerImage = await getCachedImageById(params.bannerId);

  return (
    <section className="w-full md:container ">
      <EditForm data={bannerImage} />
    </section>
  );
};

export default EditBannerPage;
