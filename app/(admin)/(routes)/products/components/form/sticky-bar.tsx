import { cn } from "@/lib/utils";
import React from "react";

type SectionId = "basic-info" | "sales-info" | "shipping-info";

const STICKY_NAV = [
  { id: "basic-info", label: "Basic Information" },
  { id: "sales-info", label: "Sales Information" },
  { id: "shipping-info", label: "Shipping Information" },
  { id: "others-info", label: "Others" },
];

interface IStickyBar {
  activeSection: string;
  handleClick: (id: SectionId) => void;
}

const StickyBar: React.FC<IStickyBar> = ({ activeSection, handleClick }) => {
  return (
    <div className="bg-white  px-4 hidden md:flex items-center  gap-6 md:rounded-md w-full sticky top-0 z-10 border-b-2 dark:bg-black dark:text-muted-foreground border">
      {STICKY_NAV.map((item) => (
        <div
          key={item.id}
          className={cn(
            "p-4 text-sm",
            activeSection === item.id
              ? "border-orange-500 border-b-4 text-orange-500 cursor-pointer "
              : "text-muted-foreground cursor-pointer dark:text-white"
          )}
          onClick={() => {
            handleClick(item.id as SectionId);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default StickyBar;
