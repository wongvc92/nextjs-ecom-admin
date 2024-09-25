import { getProductStatsCount } from "@/lib/db/queries/admin/products";
import Link from "next/link";

const ProductStats = async () => {
  const { archivedProductCount, featuredProductCount, allProductCount, outOfStockCount } = await getProductStatsCount();

  const PRODUCT_STATS = [
    {
      id: 1,
      label: "Total",
      count: allProductCount ?? 0,
      url: "/products?page=1&perPage=5",
    },
    {
      id: 2,
      label: "Featured",
      count: featuredProductCount ?? 0,
      url: "/products?page=1&perPage=5&isFeatured=TRUE",
    },
    {
      id: 3,
      label: "Archived",
      count: archivedProductCount ?? 0,
      url: "/products?page=1&perPage=5&isArchived=TRUE",
    },
    {
      id: 4,
      label: "Out of stock",
      count: outOfStockCount,
      url: "/products?page=1&perPage=5&isOutOfStock=TRUE",
    },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
        {PRODUCT_STATS.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className="border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1"
          >
            <p className="text-muted-foreground text-center text-xl font-bold">{item.count}</p>
            <p className="text-center font-light">{item.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProductStats;
