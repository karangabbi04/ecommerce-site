"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { useDropzone, Accept, FileRejection } from "react-dropzone";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
  DEFAULT_ACCEPTED_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  formatFileSize,
} from "./image-upload.utils";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ImageUploadProps<
  TFieldValues extends FieldValues,
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  label?: string;
  description?: string;

  maxFiles?: number;
  maxFileSize?: number;

  accept?: Accept;

  disabled?: boolean;

  className?: string;
}

export default function ImageUpload<
  TFieldValues extends FieldValues,
>({
  control,
  name,
  label = "Images",
  description,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  accept = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
  className,
}: ImageUploadProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  /*
   * React Hook Form field value
   *
   * We expect:
   * File[]
   */
  const files = useMemo<File[]>(() => {
    return Array.isArray(field.value) ? field.value : [];
  }, [field.value]);

  /*
   * Create previews whenever files change.
   */
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    /*
     * Cleanup object URLs when files change
     * or component unmounts.
     */
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  /*
   * Handle rejected files from react-dropzone.
   */
  const handleRejectedFiles = useCallback(
    (rejections: FileRejection[]) => {
      rejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(
              `${file.name} is too large. Maximum size is ${formatFileSize(
                maxFileSize
              )}.`
            );
            return;
          }

          if (error.code === "file-invalid-type") {
            toast.error(`${file.name} is not a supported image.`);
            return;
          }

          toast.error(error.message);
        });
      });
    },
    [maxFileSize]
  );

  /*
   * Handle accepted files.
   */
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - files.length;

      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed.`);
        return;
      }

      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      if (acceptedFiles.length > remainingSlots) {
        toast.error(
          `You can add only ${remainingSlots} more image${
            remainingSlots > 1 ? "s" : ""
          }.`
        );
      }

      if (filesToAdd.length === 0) {
        return;
      }

      const updatedFiles = [...files, ...filesToAdd];

      field.onChange(updatedFiles);
    },
    [files, field, maxFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleRejectedFiles,

    accept,

    maxSize: maxFileSize,

    multiple: true,

    disabled,

    /*
     * We intentionally don't use maxFiles here
     * because we need to account for files already selected.
     */
  });

  /*
   * Remove image.
   */
  function removeImage(index: number) {
    const updatedFiles = files.filter((_, fileIndex) => {
      return fileIndex !== index;
    });

    field.onChange(updatedFiles);
  }

  /*
   * Remove all images.
   */
  function removeAllImages() {
    field.onChange([]);
  }

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}

      <div
        {...getRootProps()}
        className={[
          "relative cursor-pointer rounded-xl border-2 border-dashed",
          "p-8 text-center transition-colors",
          "hover:border-primary/50 hover:bg-muted/30",

          isDragActive && "border-primary bg-primary/5",

          isDragReject && "border-destructive bg-destructive/5",

          disabled && "cursor-not-allowed opacity-50",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-1">
          <div className="rounded-full bg-muted p-2">
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
          </div>

          {isDragActive ? (
            <p className="font-medium">
              Drop your images here...
            </p>
          ) : (
            <>
              <p className="font-medium">
                Drag & drop images here
              </p>

            
            </>
          )}

          

          <p className="text-xs text-muted-foreground">
            Max {maxFiles} images •{" "}
            {formatFileSize(maxFileSize)} each
          </p>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />

              <span className="text-sm font-medium">
                Selected images ({files.length}/{maxFiles})
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                removeAllImages();
              }}
              disabled={disabled}
            >
              Remove all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
              >
                <img
                  src={previewUrls[index]}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeImage(index);
                  }}
                  disabled={disabled}
                  className={[
                    "absolute right-2 top-2",
                    "flex h-7 w-7 items-center justify-center",
                    "rounded-full bg-black/70 text-white",
                    "transition-opacity",
                    "hover:bg-black",
                    "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                  ].join(" ")}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Image number */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="truncate text-xs text-white">
                    {index + 1}. {file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
}