export interface SheetConfig {
    widthCm: number;
    heightCm: number;
    pixelScale: number; // pixels per cm
}

export interface CanvasObjectData {
    id: string;
    name: string;
    dataUrl: string;
    widthCm: number;
    heightCm: number;
}

export interface SelectedObjectInfo {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    locked: boolean;
}

export interface EditorSettings {
    gridVisible: boolean;
    snapToGrid: boolean;
    gridSizeCm: number;
    zoomLevel: number;
}

export interface ExportOptions {
    format: 'png' | 'pdf';
    dpi: number;
}

export type ToolAction =
    | 'select'
    | 'upload'
    | 'duplicate'
    | 'delete'
    | 'lock'
    | 'bringForward'
    | 'sendBackward';
