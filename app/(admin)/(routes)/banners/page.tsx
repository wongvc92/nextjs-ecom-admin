import React from "react";
import Banner from "./components/Banner";
import { getBannerImages } from "@/lib/db/queries/admin/banners";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banners",
  description: "Manage your Banners",
};

const BannerPage = async () => {
  const data = await getBannerImages();
  return <Banner data={data} />;
};

export default BannerPage;
