"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import NestedVariationFieldError from "./nested-variation-field-error";
import FieldLabel from "./field-label";
import { TProductSchema } from "@/lib/validation/productValidation";

interface INestedVariationField {
  variationIndex: number;
  productsData?: TProductSchema;
}
const NestedVariationField: React.FC<INestedVariationField> = ({ productsData, variationIndex }) => {
  const {
    register,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const watchVariationLabel2 = useWatch({
    control,
    name: "variations.0.nestedVariations.0.label",
  });
  const {
    fields: nestedVariationFields,
    append: appendNestedVariation,
    remove: removeNestedVariation,
  } = useFieldArray({
    control,
    name: `variations.${variationIndex}.nestedVariations`,
  });

  return (
    <>
      {watch("variationType") === "NESTED_VARIATION" && (
        <>
          <div className="grid grid-cols-4 border-b">
            <FieldLabel classname="w-fit px-2 rounded-sm ">Name</FieldLabel>
            <FieldLabel classname="w-fit px-2 rounded-sm">Price</FieldLabel>
            <FieldLabel classname="w-fit px-2 rounded-sm">Stock</FieldLabel>
            <FieldLabel classname=" w-fit px-2 rounded-sm">Sku</FieldLabel>
          </div>
          <div className="flex flex-col gap-4 space-y-4">
            {nestedVariationFields.map((item, nestedIndex) => {
              return (
                <div key={item.id} className="flex flex-col gap-4">
                  <NestedVariationFieldError errors={errors} variationIndex={variationIndex} nestedIndex={nestedIndex} />
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <Input
                      className="h-fit px-2 py-1  font-light pt-2 text-xs"
                      {...register(`variations.${variationIndex}.nestedVariations.${nestedIndex}.name` as const)}
                      disabled={
                        productsData && productsData.variations && !!productsData.variations[variationIndex]?.nestedVariations?.[nestedIndex]?.name
                      }
                      required={getValues("variationType") === "NESTED_VARIATION"}
                    />

                    <Input
                      className="h-fit px-2 py-1  font-light pt-2 text-xs"
                      {...register(`variations.${variationIndex}.nestedVariations.${nestedIndex}.price` as const)}
                      type="number"
                      step="0.01"
                      inputMode="decimal" // Helps on mobile devices to show numeric keyboard with decimal support
                      pattern="^\d+(\.\d{1,2})?$"
                      required={getValues("variationType") === "NESTED_VARIATION"}
                    />

                    <Input
                      className="h-fit px-2 py-1  font-light pt-2 text-xs"
                      {...register(`variations.${variationIndex}.nestedVariations.${nestedIndex}.stock` as const)}
                      type="number"
                      required={getValues("variationType") === "NESTED_VARIATION"}
                    />

                    <div className="relative ">
                      <Input
                        className="h-fit px-2 py-1  font-light pt-2 text-xs"
                        {...register(`variations.${variationIndex}.nestedVariations.${nestedIndex}.sku` as const)}
                        disabled={
                          productsData && productsData.variations && !!productsData.variations[variationIndex]?.nestedVariations?.[nestedIndex]?.sku
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeNestedVariation(nestedIndex)}
                        disabled={
                          nestedVariationFields.length === 1 ||
                          (productsData && productsData.variations && !!productsData.variations[variationIndex]?.nestedVariations?.[nestedIndex])
                        }
                        className={cn(
                          "w-fit absolute -right-2 -top-2",
                          nestedVariationFields.length === 1 ||
                            (productsData &&
                              productsData.variations &&
                              !!productsData.variations[variationIndex]?.nestedVariations?.[nestedIndex]?.name &&
                              "cursor-not-allowed hidden")
                        )}
                        style={{
                          display:
                            productsData && productsData.variations && !!productsData.variations[variationIndex]?.nestedVariations?.[nestedIndex]
                              ? "none"
                              : "block",
                        }}
                      >
                        <Trash2 className="text-red-500 w-5 h-5" style={{ fill: "white" }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div>
              <Button
                type="button"
                onClick={() =>
                  appendNestedVariation({
                    label: watchVariationLabel2,
                    name: "",
                    price: 0,
                    sku: "",
                    stock: 0,
                  })
                }
                className="flex items-center gap-2"
                variant="none"
              >
                <Plus />
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NestedVariationField;
