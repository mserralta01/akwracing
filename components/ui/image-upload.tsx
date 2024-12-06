"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

type PreloadedFile = {
  name: string;
  preview: string;
}

type ImageUploadProps = {
  onChange: (file: File | undefined) => void;
  value?: string;
  preloadedImage?: PreloadedFile | null;
}

export function ImageUpload({ onChange, value, preloadedImage }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    if (preloadedImage) {
      setPreview(preloadedImage.preview);
    }
  }, [preloadedImage]);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

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