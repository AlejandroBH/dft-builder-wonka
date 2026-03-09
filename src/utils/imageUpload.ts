import { MAX_IMAGE_DIMENSION } from '../constants';

/**
 * Generate a unique ID for canvas objects
 */
export function generateId(): string {
    return `obj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Read an image file and return a data URL.
 * Validates file is a PNG and optionally resizes if too large.
 */
export function readImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            resizeIfNeeded(dataUrl).then(resolve).catch(reject);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Resize image if it exceeds maximum dimensions to prevent canvas performance issues
 */
function resizeIfNeeded(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            if (img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION) {
                resolve(dataUrl);
                return;
            }

            const scale = Math.min(
                MAX_IMAGE_DIMENSION / img.width,
                MAX_IMAGE_DIMENSION / img.height
            );
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
    });
}

/**
 * Trigger browser download of a data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Trigger browser download of a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
