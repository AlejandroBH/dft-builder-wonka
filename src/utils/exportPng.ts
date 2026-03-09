import { DPI_MULTIPLIER } from '../constants';
import { downloadDataUrl } from './imageUpload';
import type * as fabric from 'fabric';

/**
 * Export the Fabric canvas as a high-resolution PNG.
 * Uses a DPI multiplier (~3.125x for 300 DPI) for print quality.
 */
export function exportCanvasAsPng(
    canvas: fabric.Canvas,
    gridGroup: fabric.Group | null,
    filename = 'gang-sheet.png'
): void {
    // Hide grid before export
    if (gridGroup) {
        gridGroup.visible = false;
    }

    // Set background to transparent for export
    const originalBg = canvas.backgroundColor;
    canvas.backgroundColor = 'transparent';

    // Deselect all objects
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: DPI_MULTIPLIER,
        enableRetinaScaling: false,
    });

    // Restore background color
    canvas.backgroundColor = originalBg;

    downloadDataUrl(dataUrl, filename);

    // Restore grid
    if (gridGroup) {
        gridGroup.visible = true;
        canvas.renderAll();
    }
}
