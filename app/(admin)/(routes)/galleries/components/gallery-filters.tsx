import React from "react";
import PublishedFilter from "./published-filter";

const GalleryFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <PublishedFilter />
    </div>
  );
};

export default GalleryFilters;
