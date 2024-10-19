"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VariationField from "../../components/form/variation-field";
import NameField from "../../components/form/name-field";
import CategoryField from "../../components/form/category-field";
import DescriptionField from "../../components/form/description-field";
import StockField from "../../components/form/stock-field";
import PriceField from "../../components/form/price-field";
import MaxPurchaseField from "../../components/form/max-purchase-field";
import MinPurchaseField from "../../components/form/min-purchase-field";
import WeightField from "../../components/form/weight-field";
import StickyBar from "../../components/form/sticky-bar";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createProduct } from "@/actions/product";
import { BadgeDollarSign, BookText, Store, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import ArchiveField from "../../components/form/archive-field";
import FeaturedField from "../../components/form/featured-field";
import SubmitButton from "@/components/submit-button";
import Link from "next/link";
import ImagesField from "../../components/form/images-field";
import { ImageCropProvider } from "@/providers/image-crop-provider";
import TagsField from "../../components/form/tags-field";
import { TCategorySchema } from "@/lib/validation/categoryValidation";
import { productSchema, TProductSchema } from "@/lib/validation/productValidation";
import DimensionField from "../../components/form/dimension-field";
type SectionId = "basic-info" | "sales-info" | "shipping-info" | "others-info";

const defaultValues = {
  variationType: "NONE",
  productImages: [],
  name: "",
  category: "",
  description: "",
  stock: 0,
  price: 0,
  minPurchase: 0,
  maxPurchase: 0,
  weight: 0,
  availableVariations: [],
  tags: [],
  lowestPrice: 0,
  isArchived: false,
  isFeatured: false,
  height: 0,
  width: 0,
  length: 0,
  variations: [
    {
      image: "",
      label: "",
      name: "",
      price: 0,
      stock: 0,
      sku: "",
      nestedVariations: [
        {
          label: "",
          name: "",
          price: 0,
          stock: 0,
          sku: "",
        },
      ],
    },
  ],
};

interface CreateFormProps {
  distinctCategories: TCategorySchema[];
  senderCount: number;
}
const CreateForm: React.FC<CreateFormProps> = ({ distinctCategories, senderCount }) => {
  const basicRef = useRef<HTMLDivElement | null>(null);
  const salesRef = useRef<HTMLDivElement | null>(null);
  const shippingRef = useRef<HTMLDivElement | null>(null);
  const othersRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("basic-info");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const methods = useForm<TProductSchema>({
    defaultValues: defaultValues,
    mode: "all",
    resolver: zodResolver(productSchema),
  });

  const sectionRefs = useMemo(
    () => ({
      "basic-info": basicRef,
      "sales-info": salesRef,
      "shipping-info": shippingRef,
      "others-info": othersRef,
    }),
    []
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  const handleClick = (id: SectionId) => {
    const ref = sectionRefs[id];
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const setVariationsName = () => {
    const product = methods.getValues();
    if (product.variationType === "NESTED_VARIATION") {
      const variationsName = product.variations && product.variations.map((v) => v.name?.toLocaleLowerCase());
      const uniqueVariationsName = Array.from(new Set(variationsName));
      const nestedVariationsName =
        product.variations &&
        product.variations.flatMap((item) => item.nestedVariations && item.nestedVariations.map((nv) => nv.name?.toLocaleLowerCase()));
      const uniqueNestedVariationsName = Array.from(new Set(nestedVariationsName));
      const availableVariations = [...uniqueVariationsName, ...uniqueNestedVariationsName] as string[];
      methods.setValue("availableVariations", availableVariations);
    } else if (product.variationType === "VARIATION") {
      const variationsName = product.variations && product.variations.map((v) => v.name?.toLocaleLowerCase());
      const uniqueVariationsName = Array.from(new Set(variationsName));
      const availableVariations = [...uniqueVariationsName] as string[];
      methods.setValue("availableVariations", availableVariations);
    }
  };

  const setLowestPrice = () => {
    const product = methods.getValues();
    let lowestPrice = Infinity;

    if (product.variationType === "NESTED_VARIATION") {
      product.variations?.forEach((variation) => {
        variation.nestedVariations?.forEach((nested) => {
          const nestedPrice = nested.price;
          if (nestedPrice && nestedPrice < lowestPrice) {
            lowestPrice = nestedPrice;
          }
        });
      });
    } else if (product.variationType === "VARIATION") {
      product.variations?.forEach((variation) => {
        const variationPrice = variation.price;
        if (variationPrice && variationPrice < lowestPrice) {
          lowestPrice = variationPrice;
        }
      });
    } else if (product.variationType === "NONE") {
      const productPrice = product.price;
      if (productPrice) {
        lowestPrice = productPrice;
      }
    }
    lowestPrice = lowestPrice === Infinity ? 0 : lowestPrice;
    methods.setValue("lowestPrice", lowestPrice);
  };

  const onSubmit = async () => {
    startTransition(async () => {
      if (!methods.getValues()) return;
      setVariationsName();
      setLowestPrice();
      const res = await createProduct(methods.getValues());
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);

        router.push("/products");
        router.refresh();
      }
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (methods.getValues()) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [methods]);

  return (
    <>
      <div className="px-4 pt-8">
        <Heading title="Create Product" description="Add a new product" />
      </div>
      <>
        {distinctCategories.length === 0 ? (
          <div className="px-4 pt-8 flex items-center gap-2">
            <p className="text-sm ">
              Please create category first{" "}
              <Link href="/categories/add-new" className="border-b-2 border-blue-500 text-blue-500">
                Create category
              </Link>
            </p>
          </div>
        ) : !!distinctCategories.length && senderCount === 0 ? (
          <div className="px-4 pt-8 flex items-center gap-2">
            <p className="text-sm ">
              Please create sender information first{" "}
              <Link href="/shippings/sender/add-new" className="border-b-2 border-blue-500 text-blue-500">
                Create sender
              </Link>
            </p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <ImageCropProvider>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 sm:px-4 ">
                <Separator className="my-4" />

                <StickyBar activeSection={activeSection} handleClick={handleClick} />

                {/* Basic information */}
                <div className=" px-2 py-4 md:p-10 flex flex-col gap-6 rounded-md w-full border" id="basic-info" ref={sectionRefs["basic-info"]}>
                  <h3 className="flex items-center gap-2 text-sm">
                    <BookText />
                    Basic information
                  </h3>
                  {/* <DisplayServerActionResponse result={result} /> */}
                  <ImagesField />
                  <NameField />
                  <CategoryField distinctCategories={distinctCategories} />
                  <TagsField />
                  <DescriptionField />
                </div>

                {/* Sales Information */}
                <div className=" px-2 py-4 md:p-10 flex flex-col gap-6 rounded-md w-full border" id="sales-info" ref={sectionRefs["sales-info"]}>
                  <h3 className="flex items-center gap-2 text-sm">
                    <BadgeDollarSign />
                    Sales Information
                  </h3>

                  <VariationField />

                  {methods.watch("variationType") === "NONE" && <PriceField />}
                  {methods.watch("variationType") === "NONE" && <StockField />}
                  <MinPurchaseField />
                  <MaxPurchaseField />
                </div>

                {/* Shipping Information */}
                <div
                  className=" px-2 py-4 md:p-10 flex flex-col gap-6 rounded-md w-full border"
                  id="shipping-info"
                  ref={sectionRefs["shipping-info"]}
                >
                  <h3 className="flex items-center gap-2 text-sm">
                    <Truck />
                    Shipping Information
                  </h3>
                  <WeightField />
                  <DimensionField />
                </div>

                {/* feature or archive  product */}
                <div className=" px-2 py-4 md:p-10 flex flex-col gap-6 rounded-md w-full border" id="others-info" ref={sectionRefs["others-info"]}>
                  <h3 className="flex items-center gap-2 text-sm">
                    <Store />
                    Others
                  </h3>

                  <div className="flex items-center gap-4">
                    <FeaturedField /> <ArchiveField />
                  </div>
                </div>
                {/* Submit form button */}
                <div className="flex justify-center mt-10">
                  <SubmitButton defaultTitle="Create product" isLoading={isPending} isLoadingTitle="Creating product..." />
                </div>
              </form>
            </ImageCropProvider>
          </FormProvider>
        )}
      </>
    </>
  );
};

export default CreateForm;
