"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { TProductSchema } from "@/lib/validation/productValidation";
import { Copy } from "lucide-react";
import React, { useCallback, useState } from "react";
import { UseFieldArrayAppend, useFormContext } from "react-hook-form";

interface DuplicateVariationProps {
  appendVariation: UseFieldArrayAppend<TProductSchema>;
}
const DuplicateVariation: React.FC<DuplicateVariationProps> = ({ appendVariation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfDuplicate, setNumberOfDuplicate] = useState(0);
  const [indextToDuplicate, setIndexToduplicate] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { watch, setValue, getValues } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const duplicateVariationFields = useCallback(() => {
    setErrorMessage("");
    if (numberOfDuplicate > 10) {
      setErrorMessage("Only up to 10 duplicates allowed");
      return;
    }
    if (selectedValue === "") {
      setErrorMessage("Please select variation");
      return;
    }
    const currentVariations = getValues("variations");

    for (let i = 0; i < numberOfDuplicate; i++) {
      if (getValues("variationType") === "NESTED_VARIATION" && currentVariations) {
        const newVariation = {
          label: currentVariations[indextToDuplicate].label,
          image: currentVariations[indextToDuplicate].image,
          name: currentVariations[indextToDuplicate].name,
          stock: currentVariations[indextToDuplicate].stock,
          price: currentVariations[indextToDuplicate].price,
          sku: currentVariations[indextToDuplicate].sku,
          nestedVariations: currentVariations[indextToDuplicate].nestedVariations?.map((nested) => ({
            label: nested.label,
            name: nested.name,
            stock: nested.stock,
            price: nested.price,
            sku: nested.sku,
          })),
        };
        appendVariation(newVariation);
      } else {
        const preDefinedRow = {
          label: getValues("variations.0.label"),
          image: "",
          name: "",
          price: 0,
          stock: 0,
          sku: "",
        };
        appendVariation(preDefinedRow);
      }
    }
    setIsOpen(false);
    setErrorMessage("");
  }, [selectedValue, indextToDuplicate, numberOfDuplicate, appendVariation, getValues]);

  const variationsName = getValues("variations")?.map((item) => item.name);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    setIndexToduplicate(selectedIndex - 1); // -1 because the first option is "Choose a category"
  };

  return (
    <div>
      <Button type="button" onClick={() => setIsOpen(true)} variant="outline" className="flex gap-2 items-center">
        <Copy className="font-light text-muted-foreground w-4" />
        <span className="hidden md:block text-sm font-light text-muted-foreground">Duplicate</span>
      </Button>
      <Modal title="Quick Duplicate" description="Duplicate variation 1 or variation 2" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col justify-start space-y-4">
          {watch("variations.0.name") === "" ? (
            <p className="text-sm text-red-500 text-center">Please fill in variation name first</p>
          ) : (
            <>
              <Label htmlFor="duplicateVariation">Choose variation to duplicate</Label>
              <span className="text-xs text-red-500">{errorMessage}</span>
              <select className="border p-2 rounded-md text-sm" required onChange={handleSelectChange} value={selectedValue}>
                <option value="">Choose a category</option>
                {variationsName
                  ?.filter((item) => item !== "")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
              <Label htmlFor="numberOfDuplicate">Number of duplicate</Label>
              <Input type="number" id="numberOfDuplicate" onChange={(e) => setNumberOfDuplicate(Number(e.target.value))} required />
              <Button disabled={numberOfDuplicate === 0 && selectedValue === ""} type="button" onClick={duplicateVariationFields}>
                Confirm
              </Button>
            </>
          )}
        </div>
      </Modal>
      <span className="text-[12px] font-light text-muted-foreground">* Quick duplicate variation 1 or 2</span>
    </div>
  );
};

export default DuplicateVariation;
