"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
};

type ImageUploadProps = {
  onChange: (file: File | null) => void;
  preloadedImage?: PreloadedFile | null;
  className?: string;
};

export function ImageUpload({ onChange, preloadedImage, className }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  // Set initial preview from preloaded image
  useEffect(() => {
    if (preloadedImage?.preview) {
      setPreview(preloadedImage.preview);
    }
  }, [preloadedImage]);

  // Cleanup function for preview URLs
  useEffect(() => {
    return () => {
      // Cleanup any created object URLs when component unmounts
      if (preview && !preloadedImage?.preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, preloadedImage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFiles([file]);
      onChange(file);
      
      // Revoke previous preview URL if it exists and wasn't from preloaded image
      if (preview && !preloadedImage?.preview) {
        URL.revokeObjectURL(preview);
      }
      
      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, [onChange, preview, preloadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    if (preview && !preloadedImage?.preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange(null);
  }, [onChange, preview, preloadedImage]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors",
        isDragActive && "border-primary bg-primary/5",
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={preview.startsWith('https://')}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            {files[0]?.name || (preloadedImage?.name && !preloadedImage.name.includes('://') 
              ? preloadedImage.name 
              : preview.startsWith('https://firebasestorage.googleapis.com') 
                ? 'Stored image' 
                : 'Current image')}
          </p>
          <p className="text-sm text-muted-foreground">
            Drop a new image to replace
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the image here ...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag & drop an image here, or click to select one
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG, GIF or WEBP (max. 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 