"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  className?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
};

export function FileUpload({
  onFileSelect,
  className,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept,
    maxSize,
    disabled,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the file here"
            : "Drag & drop a file here, or click to select"}
        </p>
      </div>
    </div>
  );
} 