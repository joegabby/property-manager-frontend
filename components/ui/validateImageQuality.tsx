/**
 * Validates if an image meets minimum quality requirements
 * @param file The image file
 * @param minWidth Minimum width in pixels
 * @param minHeight Minimum height in pixels
 * @param minSize Minimum file size in KB
 * @returns Promise<boolean> true if valid, false otherwise
 */
export function validateImageQuality(
  file: File,
  minWidth = 800,
  minHeight = 600,
  minSize = 100 // in KB
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(false);

    // Check file size first
    if (file.size < minSize * 1024) return resolve(false);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const isValid =
        img.width >= minWidth &&
        img.height >= minHeight &&
        file.size >= minSize * 1024;

      URL.revokeObjectURL(objectUrl); // cleanup
      resolve(isValid);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    img.src = objectUrl;
  });
}
