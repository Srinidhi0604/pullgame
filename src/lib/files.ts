/**
 * File handling and upload utilities
 */

/**
 * Allowed file types for uploads
 */
export const ALLOWED_FILE_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENTS: ["application/pdf", "application/msword"],
  ARCHIVES: ["application/zip", "application/x-rar-compressed"],
} as const;

/**
 * Max file sizes in bytes
 */
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * Validate file type
 */
export function isValidFileType(
  mimeType: string,
  allowedTypes: readonly string[]
): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Validate file size
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop();
  return `${timestamp}-${random}.${ext}`;
}

/**
 * Extract file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Get MIME type from extension
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    zip: "application/zip",
    txt: "text/plain",
    csv: "text/csv",
    json: "application/json",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

/**
 * Validate file metadata
 */
export function validateFileMetadata(
  filename: string,
  mimeType: string,
  fileSize: number,
  allowedTypes: readonly string[],
  maxSize: number
): { valid: boolean; error?: string } {
  if (!filename) {
    return { valid: false, error: "Filename is required" };
  }

  if (!isValidFileType(mimeType, allowedTypes)) {
    return { valid: false, error: "File type not allowed" };
  }

  if (!isValidFileSize(fileSize, maxSize)) {
    return { valid: false, error: "File size exceeds limit" };
  }

  return { valid: true };
}
