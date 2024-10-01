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
      showGrid={true}
      cropSize={{ width: 400, height: 200 }}
      style={{
        containerStyle: {
          height: 400,
          width: 200,
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
