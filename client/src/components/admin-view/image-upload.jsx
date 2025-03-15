import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  currentImage,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  console.log(isEditMode, "isEditMode");

  useEffect(() => {
    // Create preview URL for the selected file
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      setImageError(false);

      // Clean up the preview URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setImageFile(selectedFile);
      setImageError(false);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setImageFile(droppedFile);
      setImageError(false);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    setPreviewUrl(null);
    setImageError(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleImageError() {
    setImageError(true);
  }

  async function uploadImageToCloudinary() {
    try {
      if (!imageFile) {
        console.log("No image file selected");
        return;
      }

      setImageLoadingState(true);
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "photo123");

      // Log the upload URL and file details for debugging
      console.log("Uploading file:", imageFile.name);
      console.log("File type:", imageFile.type);
      console.log("File size:", imageFile.size);

      const cloudName = "dxqhk2qjn"; // Replace with your actual cloud name
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      console.log("Uploading to:", uploadUrl);

      const response = await axios.post(uploadUrl, data);

      console.log("Upload response:", response.data);

      if (response?.data?.secure_url) {
        console.log("Upload successful, URL:", response.data.secure_url);
        setUploadedImageUrl(response.data.secure_url);
      } else {
        console.error("Upload failed - no secure_url in response:", response.data);
      }
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
        />
        {!imageFile && !uploadedImageUrl && !currentImage ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
            <span className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, WEBP, GIF, SVG, BMP
            </span>
          </Label>
        ) : imageLoadingState ? (
          <div className="space-y-2">
            <Skeleton className="h-32 bg-gray-100" />
            <div className="flex justify-center">
              <span className="text-sm text-muted-foreground">Uploading image...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="w-8 text-primary h-8" />
                <p className="text-sm font-medium">
                  {imageFile?.name || "Current Image"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
            <div className="relative h-32 w-full overflow-hidden rounded border">
              {imageError ? (
                <div className="flex h-full items-center justify-center text-sm text-red-500">
                  Failed to load image
                </div>
              ) : (
                <img
                  src={previewUrl || uploadedImageUrl || currentImage}
                  alt="Product"
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
