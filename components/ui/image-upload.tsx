"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { PreloadedFile } from "@/components/equipment/equipment-form"

type ImageUploadProps = {
  onChange: (file: File | null) => void;
  preloadedImage?: PreloadedFile | null;
}

export function ImageUpload({ onChange, preloadedImage }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (preloadedImage) {
      setPreview(preloadedImage.preview);
    }
  }, [preloadedImage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      onChange(acceptedFiles[0]);
      
      // Create preview URL for the new file
      const previewUrl = URL.createObjectURL(acceptedFiles[0]);
      setPreview(previewUrl);
      
      // Clean up old preview URL
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto"
          />
          <p className="mt-2 text-sm text-gray-600">
            {files[0]?.name || preloadedImage?.name}
          </p>
          <p className="text-sm text-gray-500">
            Drop a new image to replace
          </p>
        </div>
      ) : (
        <div>
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
      )}
    </div>
  );
} 