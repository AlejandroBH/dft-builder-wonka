import { jsPDF } from 'jspdf';
import { DPI_MULTIPLIER } from '../constants';
import type * as fabric from 'fabric';
import type { SheetConfig } from '../types';

/**
 * Export the Fabric canvas as a high-resolution PDF.
 * Creates a PDF with exact sheet dimensions in cm and embeds
 * the canvas as a high-resolution PNG image.
 */
export function exportCanvasAsPdf(
    canvas: fabric.Canvas,
    sheetConfig: SheetConfig,
    gridGroup: fabric.Group | null,
    filename = 'gang-sheet.pdf'
): void {
    // Hide grid before export
    if (gridGroup) {
        gridGroup.visible = false;
        canvas.renderAll();
    }

    // Deselect all objects
    canvas.discardActiveObject();
    canvas.renderAll();

    // Generate high-res canvas data
    const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: DPI_MULTIPLIER,
        enableRetinaScaling: false,
    });

    // Create PDF with exact sheet dimensions in mm (jsPDF uses mm)
    const widthMm = sheetConfig.widthCm * 10;
    const heightMm = sheetConfig.heightCm * 10;

    const pdf = new jsPDF({
        orientation: widthMm > heightMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm],
    });

    // Add image covering full page
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');

    pdf.save(filename);

    // Restore grid
    if (gridGroup) {
        gridGroup.visible = true;
        canvas.renderAll();
    }
}
