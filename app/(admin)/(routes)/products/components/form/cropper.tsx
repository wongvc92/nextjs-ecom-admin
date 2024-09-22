"use client";
import { useImageCropContext } from "@/providers/image-crop-provider";
import EasyCropper from "react-easy-crop";

const Cropper = () => {
  const { image, zoom, setZoom, rotation, setRotation, crop, setCrop, onCropComplete } = useImageCropContext();

  return (
    <EasyCropper
      image={image || undefined}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      cropShape="rect"
      aspect={1 / 4}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onRotationChange={setRotation}
      onZoomChange={setZoom}
      showGrid={false}
      cropSize={{ width: 185, height: 185 }}
      style={{
        containerStyle: {
          height: 220,
          width: 220,
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
        },
      }}
    />
  );
};

export default Cropper;
