export interface ImageUploadProps {
  onChange: (files: FileList | undefined) => void;
  hasError?: boolean;
  altText?: string;
  uploadId?: string;
  value?: FileList;
  resetKey?: number;
  variant?: "default" | "card";
  disabled?: boolean;
  existingImageUrl?: string | null;
}
