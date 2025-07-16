import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Button from "./Button";
import ImageCropper from "./ImageCropper";
import { generateAvatar } from "@/utils/avatar";
import { compressImage, isValidImageFile } from "@/utils/image-compression";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  onAvatarChange: (file: File | null) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onCropperOpenChange?: (open: boolean) => void; // NEW
}

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
  onAvatarChange,
  size = "md",
  disabled = false,
  onCropperOpenChange, // NEW
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the file
      if (!isValidImageFile(file)) {
        alert("Please select a valid image file (JPG, PNG, WebP) under 10MB.");
        event.target.value = "";
        return;
      }

      // Create preview URL for cropping
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowCropper(true);
      if (onCropperOpenChange) onCropperOpenChange(true); // NEW
    }
    // Clear the input value to allow selecting the same file again
    event.target.value = "";
  };

  // Handle crop completion - process the cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      // Convert blob to file for compression
      const croppedFile = new File([croppedBlob], "cropped-avatar.jpg", {
        type: "image/jpeg",
      });

      // Compress the cropped image
      const compressedFile = await compressImage(croppedFile, {
        maxSizeMB: 0.5, // Keep avatars under 500KB
        maxWidthOrHeight: 400, // Reasonable size for avatars
      });

      // Create preview URL for the compressed image
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(previewUrl);

      // Call parent handler with the compressed file
      onAvatarChange(compressedFile);

      // Clean up
      setShowCropper(false);
      if (onCropperOpenChange) onCropperOpenChange(false); // NEW
      setSelectedImage(null);
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    } catch (error) {
      console.error("Error processing cropped image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle crop cancellation
  const handleCropCancel = () => {
    setShowCropper(false);
    if (onCropperOpenChange) onCropperOpenChange(false); // NEW
    setSelectedImage(null);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Call parent with null to indicate removal
    onAvatarChange(null);
  };

  // Clear preview when currentAvatarUrl changes
  useEffect(() => {
    if (!currentAvatarUrl) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [currentAvatarUrl]);

  const displayUrl = previewUrl || currentAvatarUrl;
  const avatarData = generateAvatar(userName);

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar Display */}
        <div className="relative">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={`${userName || "User"} avatar`}
              width={size === "sm" ? 64 : size === "md" ? 80 : 128}
              height={size === "sm" ? 64 : size === "md" ? 80 : 128}
              className={`${sizeClasses[size]} rounded-full object-cover`}
            />
          ) : (
            <div
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold ${textSizes[size]}`}
              style={{
                backgroundColor: avatarData.bgColor,
              }}
            >
              {avatarData.letter}
            </div>
          )}

          {/* Upload overlay */}
          {!disabled && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleUploadClick}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled || isUploading}
          >
            {isUploading
              ? "Processing..."
              : displayUrl
                ? "Change Photo"
                : "Upload Photo"}
          </Button>

          {displayUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={disabled || isUploading}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          )}
        </div>

        {/* Upload Instructions */}
        <p className="text-xs text-gray-500 text-center">
          JPG, PNG, or WebP, max 10MB. Will be cropped to square and compressed.
        </p>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
