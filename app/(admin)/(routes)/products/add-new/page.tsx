import CreateForm from "./components/create-form";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";
import { Metadata } from "next";
import { getSenderCount } from "@/lib/db/queries/admin/senders";

export const metadata: Metadata = {
  title: "View order",
  description: "Manage orders for your store",
};

const ProductPage = async () => {
  const distinctCategories = await getDistinctCategories();
  const senderCount = await getSenderCount();
  return (
    <section className="w-full md:container">
      <CreateForm distinctCategories={distinctCategories} senderCount={senderCount} />
    </section>
  );
};

export default ProductPage;
