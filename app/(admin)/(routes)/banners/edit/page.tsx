import { Metadata } from "next";
import EditForm from "./edit-form";
import { getBannerImages } from "@/lib/db/queries/admin/banners";

export const metadata: Metadata = {
  title: "Edit Banner",
  description: "Manage your Banners",
};

const EditBannerPage = async () => {
  const bannerImages = await getBannerImages();
  if (!bannerImages) {
    return <div>Banner not available</div>;
  }

  return (
    <section className="w-full md:container ">
      <EditForm data={bannerImages} />
    </section>
  );
};

export default EditBannerPage;
