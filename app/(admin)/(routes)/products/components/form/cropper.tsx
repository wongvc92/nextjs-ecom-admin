"use client";
import { useImageCropContext } from "@/providers/image-crop-provider";
import EasyCropper from "react-easy-crop";

const Cropper = ({ aspect }: { aspect: number }) => {
  const { image, zoom, setZoom, rotation, setRotation, crop, setCrop, onCropComplete } = useImageCropContext();

  return (
    <EasyCropper
      image={image || undefined}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      cropShape="rect"
      aspect={aspect}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onRotationChange={setRotation}
      onZoomChange={setZoom}
      showGrid={false}
      style={{
        containerStyle: {
          position: "relative", // Allows the cropper to fit its parent size
          width: "100%", // Ensures full width inside the modal
          height: "100%", // Ensures full height inside the modal
        },
      }}
    />
  );
};

export default Cropper;
