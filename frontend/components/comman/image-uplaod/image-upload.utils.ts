// components/common/image-upload/image-upload.utils.ts

export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DEFAULT_ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat(
    (bytes / Math.pow(1024, index)).toFixed(2)
  )} ${units[index]}`;
}

export function revokeObjectUrls(urls: string[]) {
  urls.forEach((url) => {
    URL.revokeObjectURL(url);
  });
}