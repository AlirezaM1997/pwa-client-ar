import { compressImage, maxSizeImgInBytes } from "@functions/compressImage";
import { imageToBase64Promise } from "@functions/imageToBase64Promise";
import { useState } from "react";

const useImageToBase64 = () => {
  const [base64Image, setBase64Image] = useState(null);
  const [overMaxSize, setOverMaxSize] = useState(null);

  const handleFile = async (compressedFile) => {
    const base64 = await imageToBase64Promise(compressedFile) 
    setBase64Image(base64)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > (25 * maxSizeImgInBytes)) {
        setOverMaxSize(true);
        setBase64Image(null)
      } else {
        compressImage(file, handleFile)
      }
    }
  };

  return {
    base64Image,
    handleImageChange,
    overMaxSize,
    setOverMaxSize,
  };
};

export default useImageToBase64;
