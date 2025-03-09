"use client";

import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import config from "../../data/config.json";

const accessToken = localStorage.getItem("accessToken");

interface ImageFile {
  file: File;
  url: string;
}

export default function ImageUploader() {
  const [mainImage, setMainImage] = useState<ImageFile | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<(ImageFile | null)[]>([null, null, null]);
  // New state for processed (cropped) images
  const [processedImages, setProcessedImages] = useState<{
    main: ImageFile | null;
    secondary: (ImageFile | null)[];
  }>({ main: null, secondary: [null, null, null] });
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [currentImageType, setCurrentImageType] = useState<"main" | "secondary" | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [loading, setLoading] = useState(false);

  function convertToUsername(name: string): string {
    // Convert to lowercase and replace spaces/special characters with underscores
    return (
      name
        .toLowerCase()
        // Replace all non-alphanumeric characters (except spaces) with empty string
        .replace(/[^a-z0-9\s]/g, "")
        // Replace one or more spaces with a single underscore
        .replace(/\s+/g, "-")
        // Remove leading/trailing underscores
        .replace(/^_+|_+$/g, "")
    );
  }

  // Hardcoded userName for demo; replace with actual user input or prop
  const userName = convertToUsername("Arthur Kabera");

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const smallerDimension = Math.min(width, height);
    const initialSize = smallerDimension * 0.75;
    const cropWidthPercentage = (initialSize / width) * 100;
    const cropHeightPercentage = (initialSize / height) * 100;
    const cropPercentage = Math.min(cropWidthPercentage, cropHeightPercentage);
    const newCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: cropPercentage }, 1, width, height),
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
      // Updated
        if (!file.type.startsWith("image/")) {
            setAlert({ type: "error", message: "Please upload an image file" });
            return;
        }

      const imageUrl = URL.createObjectURL(file);
      setCurrentImageType(type);
      setCurrentImageIndex(index);
      setShowModal(true);
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
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Generate filename with userName, timestamp, and type
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const imageTypeSuffix = currentImageType === "main" ? "profile" : "secondary-image";
    const fileName = `${userName}-${timestamp}-${imageTypeSuffix}.jpg`;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], fileName, { type: "image/jpeg" });
          resolve({ file, url: URL.createObjectURL(file) });
        },
        "image/jpeg",
        1.0 // Maximum quality
      );
    });
  };

  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImage();
    if (!croppedImage) return;

    // Update processedImages state
    if (currentImageType === "main") {
      setProcessedImages((prev) => ({ ...prev, main: croppedImage }));
      setMainImage(croppedImage); // Optional: keep mainImage in sync
    } else if (currentImageIndex !== null) {
      const newSecondary = [...processedImages.secondary];
      newSecondary[currentImageIndex] = croppedImage;
      setProcessedImages((prev) => ({ ...prev, secondary: newSecondary }));
      const newSecondaryImages = [...secondaryImages];
      newSecondaryImages[currentImageIndex] = croppedImage;
      setSecondaryImages(newSecondaryImages); // Optional: keep secondaryImages in sync
    }

    setShowModal(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!processedImages.main || !processedImages.secondary.every((img) => img !== null)) {
      return;
    }
  
    try {
      if (!accessToken) {
        console.error("No access token found");
        return;
      }
  
      // 1️⃣ Upload Main Image First
      const mainFormData = new FormData();
      mainFormData.append("mainImage", processedImages.main.file);
  
      const mainResponse = await fetch(`${config.baseUrl}/api/new-image-upload`, {
        method: "POST",
        body: mainFormData,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });
  
      if (!mainResponse.ok) {
        throw new Error("Main image upload failed");
      }
  
      console.log("Main image uploaded successfully!");
  
      // 2️⃣ Upload Secondary Images One by One
      for (const img of processedImages.secondary) {
        const secondaryFormData = new FormData();
        secondaryFormData.append("secondaryImages", img!.file);
  
        const secResponse = await fetch(`${config.baseUrl}/api/new-image-upload`, {
          method: "POST",
          body: secondaryFormData,
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
  
        if (!secResponse.ok) {
          throw new Error("Secondary image upload failed");
        }
  
        console.log(`Secondary image ${img!.file.name} uploaded successfully!`);
      }
  
      setAlert({ type: "success", message: "Files uploaded successfully!" });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setAlert({ type: "error", message: "Failed to upload files. Please try again." });
    }
    setLoading(false);
  };
  

  const isSubmitDisabled: boolean =
    !processedImages.main || processedImages.secondary.some((img) => img === null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-red-600 text-xl">
            You must upload four images of yourself to proceed to other parts of the app. We use this information as a security measure against spamming 
            to ensure our users get utmost value and real connections from our app.
          </p>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Main Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-72 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
            {processedImages.main ? (
              <div className="relative w-full h-full">
                <img src={processedImages.main.url} alt="Main" className="w-full h-full object-cover" />
                <button
                  onClick={() => setProcessedImages((prev) => ({ ...prev, main: null }))}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-gray-600 text-sm">Click to upload main image (square)</span>
              </label>
            )}
          </div>
        </div>

        {/* Secondary Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Secondary Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {processedImages.secondary.map((img, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
              >
                {img ? (
                  <div className="relative w-full h-full">
                    <img src={img.url} alt={`Secondary ${index}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const newSecondary = [...processedImages.secondary];
                        newSecondary[index] = null;
                        setProcessedImages((prev) => ({ ...prev, secondary: newSecondary }));
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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
          disabled={isSubmitDisabled || loading}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
            isSubmitDisabled || loading 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          type="button"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* Crop Modal */}
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
              aspect={1}
              className="max-h-[60vh]"
              locked={false}
            >
              <img
                ref={imgRef}
                src={currentImageType === "main" ? mainImage?.url : secondaryImages[currentImageIndex ?? 0]?.url}
                onLoad={onImageLoad}
                alt="Crop preview"
                className="rounded-md"
              />
            </ReactCrop>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                type="button"
              >
                Apply Square Crop
              </button>
            </div>
          </div>
        </div>
      )}

        {alert && (
        <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
            <p>{alert.message}</p>
            <button
            onClick={() => setAlert(null)}
            className="ml-4 text-sm underline hover:text-gray-200"
            >
            Close
            </button>
        </div>
        )}
    </div>
  );
}