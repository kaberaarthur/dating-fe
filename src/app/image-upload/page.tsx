// components/ImageUploader.tsx
"use client";

import { useState, useRef } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageFile {
  file: File;
  url: string;
}

export default function ImageUploader() {
  const [mainImage, setMainImage] = useState<ImageFile | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<(ImageFile | null)[]>([
    null,
    null,
    null,
  ]);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [currentImageType, setCurrentImageType] = useState<"main" | "secondary" | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Start with a moderate size square crop (50% of the smaller dimension)
    const smallerDimension = Math.min(width, height);
    const initialSize = smallerDimension * 0.75; // 75% of the smaller dimension as a starting point
    
    // Calculate percentage
    const cropWidthPercentage = (initialSize / width) * 100;
    const cropHeightPercentage = (initialSize / height) * 100;
    const cropPercentage = Math.min(cropWidthPercentage, cropHeightPercentage);
    
    // Create a centered square crop
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: cropPercentage,
        },
        1, // Keep aspect ratio as 1:1 (square)
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "secondary",
    index: number | null = null
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setCurrentImageType(type);
      setCurrentImageIndex(index);
      
      // Always show crop modal for any uploaded image
      setShowModal(true);
      
      // Store the temporary image for cropping
      if (type === "main") {
        setMainImage({ file, url: imageUrl });
      } else if (index !== null) {
        const newSecondaryImages = [...secondaryImages];
        newSecondaryImages[index] = { file, url: imageUrl };
        setSecondaryImages(newSecondaryImages);
      }
    }
  };

  const getCroppedImage = async (): Promise<ImageFile | null> => {
    if (!completedCrop || !imgRef.current) return null;
  
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    // Set canvas size to the cropped area in the original image's resolution
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;
    canvas.width = cropWidth;
    canvas.height = cropHeight;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
  
    // Draw the cropped area from the original image at full resolution
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, // Source x in original image
      completedCrop.y * scaleY, // Source y in original image
      cropWidth,               // Source width in original image
      cropHeight,              // Source height in original image
      0,                       // Destination x
      0,                       // Destination y
      cropWidth,               // Destination width (matches source)
      cropHeight               // Destination height (matches source)
    );
  
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], "square-image.jpg", { type: "image/jpeg" });
          resolve({ file, url: URL.createObjectURL(file) });
        },
        "image/jpeg",
        1.0 // Set quality to maximum (1.0) to avoid compression loss
      );
    });
  };

  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImage();
    if (!croppedImage) return;

    if (currentImageType === "main") {
      setMainImage(croppedImage);
    } else if (currentImageIndex !== null) {
      const newSecondaryImages = [...secondaryImages];
      newSecondaryImages[currentImageIndex] = croppedImage;
      setSecondaryImages(newSecondaryImages);
    }
    setShowModal(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleSubmit = () => {
    if (mainImage && secondaryImages.every((img) => img !== null)) {
      console.log({
        mainImage: mainImage.file,
        secondaryImages: secondaryImages.map((img) => img!.file),
      });
      // Here you would typically upload the images to your server
    }
  };

  const isSubmitDisabled: boolean = !mainImage || secondaryImages.some((img) => img === null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            All images will be cropped to a square format. Upload your images and use the cropping tool to select the best square area. 
            You can resize the square crop area to include more or less of your image.
          </p>
        </div>
        
        {/* First Row - Main Image */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Main Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-72 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
            {mainImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={mainImage.url} 
                  alt="Main" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  onClick={() => setMainImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  type="button"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "main")}
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-gray-600 text-sm">Click to upload main image (square)</span>
              </label>
            )}
          </div>
        </div>

        {/* Second Row - Secondary Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Secondary Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {secondaryImages.map((img, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
              >
                {img ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={img.url} 
                      alt={`Secondary ${index}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      onClick={() => {
                        const newSecondaryImages = [...secondaryImages];
                        newSecondaryImages[index] = null;
                        setSecondaryImages(newSecondaryImages);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "secondary", index)}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-gray-600 text-xs">Upload square image</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
            isSubmitDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          type="button"
        >
          Submit
        </button>
      </div>

      {/* Crop Modal - Dark Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl max-w-2xl w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Crop Image to Square</h3>
            <p className="text-gray-300 mb-4">
              Drag to position and resize the crop area while maintaining a square shape. 
              <strong> Use the corner handles to adjust the size</strong> of the square.
            </p>
            
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1} // Lock to 1:1 aspect ratio
              className="max-h-[60vh]"
              locked={false} // Allow resizing but lock the aspect ratio
            >
              <img
                ref={imgRef}
                src={
                  currentImageType === "main"
                    ? mainImage?.url
                    : secondaryImages[currentImageIndex ?? 0]?.url
                }
                onLoad={onImageLoad}
                alt="Crop preview"
                className="rounded-md"
              />
            </ReactCrop>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  // If canceling from an initial upload, remove the temporary image
                  if (currentImageType === "main" && !mainImage?.url) {
                    setMainImage(null);
                  } else if (currentImageType === "secondary" && currentImageIndex !== null && !secondaryImages[currentImageIndex]?.url) {
                    const newSecondaryImages = [...secondaryImages];
                    newSecondaryImages[currentImageIndex] = null;
                    setSecondaryImages(newSecondaryImages);
                  }
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                type="button"
              >
                Apply Square Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}