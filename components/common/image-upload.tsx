"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { X, UploadCloud, Camera, Trash2 } from "lucide-react";
import { toast } from "@/lib/providers/toaster-provider";
import { ACCEPTED_FILE_TYPES } from "@/lib/constants/files";
import { Button } from "../ui/button";
import { ImageUploadProps } from "@/types/api/profile";

export const ImageUpload = ({
  onChange,
  hasError = false,
  altText = "Image Preview",
  uploadId = "imageUpload",
  value,
  resetKey,
  variant = "default",
  disabled = false,
  existingImageUrl,
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (value && value.length > 0) return URL.createObjectURL(value[0]);
    if (existingImageUrl) return existingImageUrl;
    return null;
  });

  const [isExistingImage, setIsExistingImage] = useState(!!existingImageUrl);
  const [hasRemovedExisting, setHasRemovedExisting] = useState(false);
  const [hasNewUpload, setHasNewUpload] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileUploadedRef = useRef(false);

  useEffect(() => {
    if (fileUploadedRef.current) {
      fileUploadedRef.current = false;
      return;
    }
    if (value && value.length > 0) {
      setPreviewUrl(URL.createObjectURL(value[0]));
      setIsExistingImage(false);
      setHasRemovedExisting(false);
      setHasNewUpload(true);
    } else if (hasRemovedExisting) {
      setPreviewUrl(null);
      setIsExistingImage(false);
    } else if (existingImageUrl && !hasNewUpload) {
      setPreviewUrl(existingImageUrl);
      setIsExistingImage(true);
    } else if (!existingImageUrl && !hasRemovedExisting) {
      setPreviewUrl(null);
      setIsExistingImage(false);
      setInputKey((p) => p + 1);
    }
  }, [value, existingImageUrl, hasRemovedExisting, hasNewUpload]);

  useEffect(() => {
    if (resetKey === undefined) return;
    if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
      setIsExistingImage(true);
      setHasRemovedExisting(false);
      setHasNewUpload(false);
    } else {
      setPreviewUrl(null);
      setIsExistingImage(false);
      setHasRemovedExisting(false);
      setHasNewUpload(false);
    }
    setInputKey((p) => p + 1);
    fileUploadedRef.current = false;
  }, [resetKey, existingImageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl && !isExistingImage && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, isExistingImage]);

  const triggerFileInput = () => {
    if (disabled) return;
    document.getElementById(uploadId)?.click();
  };

  const processFile = (file: File, fileList?: FileList) => {
    if (disabled) return;
    if (
      !ACCEPTED_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_FILE_TYPES)[number]
      )
    ) {
      toast.error("Only JPEG, PNG, HEIC, AVIF, GIF and WebP files are allowed");
      setInputKey((p) => p + 1);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      setInputKey((p) => p + 1);
      return;
    }
    fileUploadedRef.current = true;
    setPreviewUrl(URL.createObjectURL(file));
    setIsExistingImage(false);
    setHasRemovedExisting(false);
    setHasNewUpload(true);
    onChange(fileList);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) processFile(file, e.target.files ?? undefined);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    // Always reset dragging state; the guard is in handleDragOver
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, e.dataTransfer.files);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setPreviewUrl(null);
    setIsExistingImage(false);
    setHasNewUpload(false);
    onChange(undefined);
    if (existingImageUrl) setHasRemovedExisting(true);
    fileUploadedRef.current = false;
    setInputKey((p) => p + 1);
  };

  const fileTypes = ACCEPTED_FILE_TYPES.map((t) =>
    t.replace("image/", "").toUpperCase()
  );

  /* ── CARD VARIANT ── */
  if (variant === "card") {
    return (
      <div
        className="relative flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => triggerFileInput()}
      >
        <Input
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          className="hidden"
          id={uploadId}
          key={inputKey}
          onChange={handleFileChange}
          disabled={disabled}
        />

        {previewUrl ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={altText}
              className={`size-36 rounded-full object-cover border-[3px] border-white shadow-lg ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:scale-[1.02]"
              }`}
            />

            {/* Hover overlay */}
            {!disabled && (
              <div className="absolute inset-0 rounded-full bg-indigo-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
            )}
            {/* Remove button */}
            {!disabled && (
              <Button
                size="icon"
                variant="destructive"
                type="button"
                disabled={disabled}
                onClick={removeImage}
                className="absolute -top-0.5 -right-0.5 h-7 w-7 rounded-full border-2 border-white text-white flex items-center justify-center shadow-md transition-colors z-10"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`size-36 rounded-full flex flex-col items-center justify-center gap-1.5
            bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-dashed
            transition-all
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:scale-[1.02]"
            }
            ${hasError ? "border-red-300" : "border-indigo-300"}`}
          >
            <Camera
              className={`h-6 w-6 ${
                hasError ? "text-red-400" : "text-indigo-500"
              }`}
            />
            <span
              className={`text-[10px] font-semibold tracking-wide ${
                hasError ? "text-red-400" : "text-indigo-500"
              }`}
            >
              UPLOAD
            </span>
          </div>
        )}
        <p className="text-xs text-slate-400 font-light">
          Click to {previewUrl ? "change" : "upload"} photo
        </p>
      </div>
    );
  }

  /* ── DEFAULT VARIANT ── */
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center rounded-2xl min-h-[240px] w-full
        transition-all duration-200 overflow-hidden
        ${
          previewUrl
            ? "border-0 bg-transparent p-0"
            : "p-6 border-[1.5px] border-dashed"
        }
        ${
          !previewUrl &&
          (hasError
            ? "border-red-300 bg-red-50/50 shadow-[0_0_0_3px_rgba(239,68,68,0.07)]"
            : isDragging
            ? "border-indigo-500 bg-indigo-50 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
            : "border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] hover:-translate-y-px")
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={() => triggerFileInput()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Subtle grid pattern */}
      {!previewUrl && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <Input
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        id={uploadId}
        key={inputKey}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {previewUrl ? (
        /* ── Preview ── */
        <div className="relative w-full min-h-[240px] rounded-2xl overflow-hidden group border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={altText}
            className="w-full max-h-[260px] object-cover block"
          />

          {/* Gradient overlay on hover */}
          {!disabled && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}

          {/* Bottom action bar */}
          {!disabled && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 transition-colors"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Replace image
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center justify-center p-2 rounded-lg bg-red-500/80 hover:bg-red-500 backdrop-blur-sm border border-red-400/30 text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center gap-5 text-center pointer-events-none z-10">
          {/* Icon */}
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all
            ${
              hasError
                ? "bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-[0_2px_8px_rgba(239,68,68,0.12),0_0_0_8px_rgba(239,68,68,0.05)]"
                : "bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-[0_2px_8px_rgba(99,102,241,0.12),0_0_0_8px_rgba(99,102,241,0.05)]"
            }`}
          >
            {hasError ? (
              <svg
                className="h-7 w-7 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <UploadCloud className="h-7 w-7 text-indigo-500" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <p
              className={`text-sm font-semibold tracking-tight ${
                hasError ? "text-red-800" : "text-slate-800"
              }`}
            >
              {hasError ? (
                "Image required"
              ) : (
                <>
                  <span
                    className={`${
                      isDragging ? "text-indigo-700" : "text-indigo-600"
                    } underline underline-offset-2`}
                  >
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p
              className={`text-xs font-light ${
                hasError ? "text-red-400" : "text-slate-400"
              }`}
            >
              {hasError
                ? "Please upload a valid image to continue"
                : "Max. 2MB per file"}
            </p>
          </div>

          {/* Format pills */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {fileTypes.map((type) => (
              <span
                key={type}
                className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border
                ${
                  hasError
                    ? "bg-red-50 text-red-400 border-red-200/60"
                    : "bg-indigo-50 text-indigo-500 border-indigo-200/60"
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
