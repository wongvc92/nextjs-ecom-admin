import EditForm from "./components/edit-form";
import { getProductById } from "@/lib/db/queries/admin/products";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";
import { convertCentsToTwoDecimalNumber, convertGramToKilogram } from "@/lib/utils";
import { TProductSchema } from "@/lib/validation/productValidation";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const productData = await getProductById(params.productId);
  const distinctCategoriesData = await getDistinctCategories();
  const [product, distinctCategories] = await Promise.all([productData, distinctCategoriesData]);

  const productWithId: TProductSchema = {
    id: product?.id ?? "",
    name: product?.name ?? "",
    category: product?.category ?? "",
    tags: product?.tags ?? [],
    availableVariations: product?.availableVariations ?? [],
    lowestPrice: product?.lowestPriceInCents as number,
    description: product?.description!,
    variationType: product?.variationType!,
    price: convertCentsToTwoDecimalNumber(product?.priceInCents as number) ?? 0,
    stock: product?.stock ?? 0,
    minPurchase: product?.minPurchase ?? 0,
    maxPurchase: product?.maxPurchase ?? 0,
    weight: convertGramToKilogram(product?.weightInGram as number) ?? 0,
    shippingFee: convertCentsToTwoDecimalNumber(product?.shippingFeeInCents as number) ?? 0,
    productImages:
      product?.productImages.map((image) => ({
        id: image.id,
        url: image.url,
      })) || [],
    isArchived: product?.isArchived ?? false,
    isFeatured: product?.isFeatured ?? false,
    variations:
      product && product.variations
        ? product.variations.map((v) => ({
            id: v.id,
            label: v.label ?? "",
            name: v.name ?? "",
            image: v.image ?? "",
            sku: v.sku! ?? "",
            price: convertCentsToTwoDecimalNumber(v.priceInCents as number) ?? 0,
            stock: v.stock ?? 0,
            nestedVariations:
              v && v.nestedVariations
                ? v.nestedVariations.map((nv) => ({
                    id: nv.id,
                    label: nv.label ?? "",
                    name: nv.name ?? "",
                    sku: nv.sku ?? "",
                    price: convertCentsToTwoDecimalNumber(nv.priceInCents as number) ?? 0,
                    stock: nv.stock ?? 0,
                  }))
                : undefined,
          }))
        : undefined,
  };

  return (
    <section className="md:container w-full">
      <EditForm productsData={productWithId} productId={params.productId} distinctCategories={distinctCategories} />
    </section>
  );
};

export default ProductPage;
