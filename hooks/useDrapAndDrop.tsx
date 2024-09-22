"use client";

import { closestCenter, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction } from "react";

interface Image {
  id: string;
  url: string;
}

export const useDragAndDrop = (previewImages: Image[], setPreviewImages: Dispatch<SetStateAction<Image[]>>) => {
  const getUrlpos = (id: string) => previewImages.findIndex((task) => task.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = getUrlpos(active.id.toString());
    const newIndex = getUrlpos(over.id.toString());

    let sortedImages: Image[] = [];
    setPreviewImages((prevImages) => {
      const newPrevUrls = arrayMove(prevImages, oldIndex, newIndex);
      sortedImages = newPrevUrls;
      return newPrevUrls;
    });

    return sortedImages;
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  return {
    sensors,
    handleDragEnd,
    SortableContext,
    closestCenter,
    horizontalListSortingStrategy,
    DndContext,
  };
};
