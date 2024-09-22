import getCroppedImg from "@/lib/cropImage";
import { Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from "react";
import { Area } from "react-easy-crop";
import { createContext } from "react"; // Correct import from 'react'

interface CropResult {
  file: File;
  url: string;
}

interface IImageCropContext {
  imageToDelete: string | null;
  setImageToDelete: Dispatch<SetStateAction<string | null>>;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  rotation: number;
  setRotation: Dispatch<SetStateAction<number>>;
  crop: { x: number; y: number };
  setCrop: Dispatch<SetStateAction<{ x: number; y: number }>>;
  croppedAreaPixels: Area | null;
  setCroppedAreaPixels: Dispatch<SetStateAction<Area | null>>;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  getProcessedImage: () => Promise<File | undefined>;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleRotateAntiCw: () => void;
  handleRotateCw: () => void;
  max_zoom: number;
  min_zoom: number;
  zoom_step: number;
  max_rotation: number;
  min_rotation: number;
  rotation_step: number;
  resetStates: () => void;
}

export const ImageCropContext = createContext<IImageCropContext | undefined>(undefined); // PascalCase for context name

const defaultImage = null;
const defaultImageToDelete = null;
const defaultCrop = { x: 0, y: 0 };
const defaultRotation = 0;
const defaultZoom = 1;
const defaultCroppedAreaPixels = null;

interface ImageCropProviderProps {
  max_zoom?: number;
  min_zoom?: number;
  zoom_step?: number;
  max_rotation?: number;
  min_rotation?: number;
  rotation_step?: number;
  children: ReactNode;
}

export const ImageCropProvider = ({
  max_zoom = 3,
  min_zoom = 1,
  zoom_step = 0.1,
  max_rotation = 360,
  min_rotation = 0,
  rotation_step = 5,
  children,
}: ImageCropProviderProps) => {
  const [image, setImage] = useState<string | null>(defaultImage);
  const [imageToDelete, setImageToDelete] = useState<string | null>(defaultImageToDelete);
  const [crop, setCrop] = useState(defaultCrop);
  const [zoom, setZoom] = useState(defaultZoom);
  const [rotation, setRotation] = useState(defaultRotation);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(defaultCroppedAreaPixels);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleZoomIn = useCallback(() => {
    if (zoom < max_zoom) {
      setZoom(zoom + zoom_step * 2);
    }
  }, [max_zoom, zoom, zoom_step]);

  const handleZoomOut = useCallback(() => {
    if (zoom > min_zoom) {
      setZoom(zoom - zoom_step * 2);
    }
  }, [min_zoom, zoom, zoom_step]);

  const handleRotateCw = useCallback(() => {
    setRotation(rotation + rotation_step);
  }, [rotation, rotation_step]);

  const handleRotateAntiCw = useCallback(() => {
    setRotation(rotation - rotation_step);
  }, [rotation, rotation_step]);

  const getProcessedImage = useCallback(async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = (await getCroppedImg(image, croppedAreaPixels, rotation)) as CropResult;
      const imageFile = new File([croppedImage.file], `img-${Date.now()}.png`, {
        type: "image/png",
      });
      return imageFile;
    }
    return undefined;
  }, [croppedAreaPixels, image, rotation]);

  const resetStates = () => {
    setImage(defaultImage);
    setCrop(defaultCrop);
    setRotation(defaultRotation);
    setZoom(defaultZoom);
    setCroppedAreaPixels(defaultCroppedAreaPixels);
  };

  const contextValue = useMemo(
    () => ({
      imageToDelete,
      setImageToDelete,
      image,
      setImage,
      zoom,
      setZoom,
      rotation,
      setRotation,
      crop,
      setCrop,
      croppedAreaPixels,
      setCroppedAreaPixels,
      onCropComplete,
      getProcessedImage,
      handleZoomIn,
      handleZoomOut,
      handleRotateAntiCw,
      handleRotateCw,
      max_zoom,
      min_zoom,
      zoom_step,
      max_rotation,
      min_rotation,
      rotation_step,
      resetStates,
    }),
    [
      imageToDelete,
      setImageToDelete,
      crop,
      croppedAreaPixels,
      getProcessedImage,
      handleRotateAntiCw,
      handleRotateCw,
      handleZoomIn,
      handleZoomOut,
      image,
      max_rotation,
      max_zoom,
      min_rotation,
      min_zoom,
      onCropComplete,
      rotation,
      rotation_step,
      zoom,
      zoom_step,
    ]
  );

  return <ImageCropContext.Provider value={contextValue}>{children}</ImageCropContext.Provider>;
};

export const useImageCropContext = () => {
  const context = useContext(ImageCropContext);
  if (!context) {
    throw new Error("useImageCropContext must be used within an ImageCropProvider");
  }
  return context;
};
