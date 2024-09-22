"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TProductSchema } from "@/lib/validation/productValidation";
import React, { useCallback, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface ApplyToAllProps {
  productsData?: TProductSchema;
}
const ApplyToAll: React.FC<ApplyToAllProps> = ({ productsData }) => {
  const { setValue, control, getValues } = useFormContext<TProductSchema>(); // retrieve all hook methods
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newSku, setNewSku] = useState("");
  const newPriceInputRef = useRef<HTMLInputElement | null>(null);
  const newStockInputRef = useRef<HTMLInputElement | null>(null);
  const newSkuInputRef = useRef<HTMLInputElement | null>(null);

  const { fields: variationFields } = useFieldArray({
    control,
    name: "variations", // Unique name for your Field Array
  });

  const updateValueForAll = useCallback(() => {
    if (newPriceInputRef.current && newPriceInputRef.current.value) {
      variationFields.forEach((_, index) => {
        if (getValues("variationType") === "VARIATION") {
          // Update the price for the current variation
          setValue(`variations.${index}.price`, Number(newPrice));
        } else if (getValues("variationType") === "NESTED_VARIATION") {
          getValues("variations.0.nestedVariations")?.forEach((_, nestedIndex) => {
            setValue(`variations.${index}.nestedVariations.${nestedIndex}.price`, Number(newPrice));
          });
        }
      });
    } else if (newStockInputRef.current && newStockInputRef.current.value) {
      variationFields.forEach((_, index) => {
        if (getValues("variationType") === "VARIATION") {
          // Update the price for the current variation

          setValue(`variations.${index}.stock`, Number(newStock));
        } else if (getValues("variationType") === "NESTED_VARIATION") {
          getValues("variations.0.nestedVariations")?.forEach((_, nestedIndex) => {
            setValue(`variations.${index}.nestedVariations.${nestedIndex}.stock`, Number(newStock));
          });
        }
      });
    } else if (newSkuInputRef.current && newSkuInputRef.current.value) {
      variationFields.forEach((_, index) => {
        if (getValues("variationType") === "VARIATION") {
          setValue(`variations.${index}.sku`, newSku);
        } else if (getValues("variationType") === "NESTED_VARIATION") {
          getValues("variations.0.nestedVariations")?.forEach((_, nestedIndex) => {
            setValue(`variations.${index}.nestedVariations.${nestedIndex}.sku`, newSku);
          });
        }
      });
    }

    if (newPriceInputRef.current) {
      newPriceInputRef.current.value = "";
    }

    if (newStockInputRef.current) {
      newStockInputRef.current.value = "";
    }

    if (newSkuInputRef.current) {
      newSkuInputRef.current.value = "";
    }
  }, [newPrice, newSku, newStock, newPriceInputRef, newSkuInputRef, newStockInputRef, setValue, variationFields, getValues]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          className="h-fit px-2 py-1 text-sm font-light"
          ref={newPriceInputRef}
          type="text"
          placeholder="Price"
          onChange={(e) => {
            const value = e.target.value;
            const twoDecimalValue = Number(value).toFixed(2);
            setNewPrice(twoDecimalValue);
          }}
        />
        <Input
          className="h-fit px-2 py-1 text-sm font-light"
          ref={newStockInputRef}
          type="text"
          placeholder="Stock"
          onChange={(e) => {
            const value = e.target.value;
            setNewStock(value);
          }}
        />
        <Input
          disabled={!!productsData}
          className="h-fit px-2 py-1 text-sm font-light"
          ref={newSkuInputRef}
          type="text"
          placeholder="SKU"
          onChange={(e) => {
            const value = e.target.value;
            setNewSku(value);
          }}
        />
        <Button
          type="button"
          className=" flex items-center gap-1  h-fit px-2 py-1 text-sm font-light"
          variant="secondary"
          onClick={updateValueForAll}
        >
          Apply
        </Button>
      </div>
      <span className="text-[12px] text-muted-foreground">* Quick apply the same value to all variation 1 or 2</span>
    </div>
  );
};

export default ApplyToAll;
