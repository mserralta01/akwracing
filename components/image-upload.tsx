"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUploadProps } from '@/types/course';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeImage = () => {
    setPreview(undefined);
    onChange(null);
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition
          ${isDragActive ? 'border-primary' : 'border-muted-foreground/25'}
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative aspect-video">
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <div className="text-muted-foreground text-sm">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <p>Drag & drop an image here, or click to select one</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
