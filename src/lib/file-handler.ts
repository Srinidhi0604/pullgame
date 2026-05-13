/**
 * File handling and upload utilities
 */

import { promises as fs } from "fs";
import path from "path";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

export interface UploadOptions {
  maxSizeMb: number;
  allowedTypes: string[];
  uploadDir: string;
}

/**
 * Validate file size
 */
export function isValidFileSize(fileSize: number, maxSizeMb: number): boolean {
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  return fileSize <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string, allowedTypes: string[]): boolean {
  if (allowedTypes.includes("*")) return true;

  // Check exact match
  if (allowedTypes.includes(mimeType)) return true;

  // Check wildcard like "image/*"
  const type = mimeType.split("/")[0];
  return allowedTypes.some((allowed) => allowed === `${type}/*`);
}

/**
 * Get file extension from mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "text/plain": "txt",
    "application/json": "json",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  };

  return mimeMap[mimeType] || "bin";
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string): string {
  // Remove path separators and dangerous characters
  const baseName = path.basename(originalName);
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^\.+/, "") // Remove leading dots
    .slice(0, 255); // Max filename length

  return sanitized || "file";
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${baseName}_${timestamp}_${random}${ext}`;
}

/**
 * Validate file buffer
 */
export function isValidBuffer(buffer: unknown): buffer is Buffer {
  return Buffer.isBuffer(buffer);
}

/**
 * Get buffer from string
 */
export function stringToBuffer(str: string, encoding: BufferEncoding = "utf-8"): Buffer {
  return Buffer.from(str, encoding);
}

/**
 * Get string from buffer
 */
export function bufferToString(buffer: Buffer, encoding: BufferEncoding = "utf-8"): string {
  return buffer.toString(encoding);
}

/**
 * Calculate file hash (MD5)
 */
export function calculateFileHash(buffer: Buffer): string {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(buffer).digest("hex");
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const ext = path.extname(filename);
  return ext.startsWith(".") ? ext.substring(1) : ext;
}

/**
 * Check if file is image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is PDF
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType === "application/pdf";
}

/**
 * Check if file is text
 */
export function isTextFile(mimeType: string): boolean {
  return (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml"
  );
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Save file to disk
 */
export async function saveFile(
  filePath: string,
  content: Buffer | string
): Promise<string> {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content);
    return filePath;
  } catch (error) {
    throw new Error(`Failed to save file: ${error}`);
  }
}

/**
 * Read file from disk
 */
export async function readFile(filePath: string): Promise<Buffer> {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
}

/**
 * Delete file from disk
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file stats
 */
export async function getFileStats(filePath: string): Promise<FileInfo | null> {
  try {
    const stats = await fs.stat(filePath);
    return {
      name: path.basename(filePath),
      size: stats.size,
      type: getFileExtension(filePath),
      lastModified: stats.mtime,
    };
  } catch {
    return null;
  }
}

/**
 * List files in directory
 */
export async function listFiles(dirPath: string): Promise<FileInfo[]> {
  try {
    const files = await fs.readdir(dirPath);
    const fileInfos: FileInfo[] = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const info = await getFileStats(filePath);
      if (info) fileInfos.push(info);
    }

    return fileInfos;
  } catch {
    return [];
  }
}

/**
 * Clean up old files
 */
export async function cleanupOldFiles(dirPath: string, ageMs: number): Promise<number> {
  try {
    const files = await fs.readdir(dirPath);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > ageMs) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch {
    return 0;
  }
}
