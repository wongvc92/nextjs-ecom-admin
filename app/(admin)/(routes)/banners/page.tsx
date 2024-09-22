import React from "react";
import Banner from "./components/Banner";
import { getBannerImages } from "@/lib/db/queries/admin/banners";

const BannerPage = async () => {
  const data = await getBannerImages();
  return <Banner data={data} />;
};

export default BannerPage;
