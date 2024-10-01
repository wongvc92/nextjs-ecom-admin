import React from "react";
import CreateForm from "./create-form";
import { Metadata } from "next";
import { getBannerImagesCount } from "@/lib/db/queries/admin/banners";

export const metadata: Metadata = {
  title: "Add Banner",
  description: "Manage your Banners",
};

const AddNewPage = async () => {
  const bannerImagesCount = await getBannerImagesCount();
  console.log("bannerImagesCount", bannerImagesCount);
  return (
    <section className="w-full md:container">
      <CreateForm bannerImagesCount={bannerImagesCount} />
    </section>
  );
};

export default AddNewPage;
