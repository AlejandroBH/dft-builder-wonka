import type { SheetConfig, EditorSettings } from '../types';

/** Pixels per centimeter for canvas rendering */
export const DEFAULT_PIXEL_SCALE = 10;

/** Default sheet configuration */
export const DEFAULT_SHEET_CONFIG: SheetConfig = {
    widthCm: 58,
    heightCm: 100,
    pixelScale: DEFAULT_PIXEL_SCALE,
};

/** Default editor settings */
export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
    gridVisible: true,
    snapToGrid: true,
    gridSizeCm: 1,
    zoomLevel: 1,
};

/** Target DPI for print exports */
export const EXPORT_DPI = 300;

/** Screen DPI baseline */
export const SCREEN_DPI = 96;

/** DPI multiplier for high-res export */
export const DPI_MULTIPLIER = EXPORT_DPI / SCREEN_DPI;

/** Available sheet widths in cm */
export const SHEET_WIDTHS = [30, 40, 58, 60, 80, 100];

/** Available sheet heights in cm */
export const SHEET_HEIGHTS = [50, 75, 100, 120, 150, 200, 250, 300];

/** Minimum zoom level */
export const MIN_ZOOM = 0.25;

/** Maximum zoom level */
export const MAX_ZOOM = 3;

/** Zoom step increment */
export const ZOOM_STEP = 0.25;

/** Grid line color */
export const GRID_LINE_COLOR = 'rgba(200, 200, 200, 0.5)';

/** Grid major line color (every 5cm) */
export const GRID_MAJOR_LINE_COLOR = 'rgba(150, 150, 150, 0.7)';

/** Canvas background color */
export const CANVAS_BG_COLOR = '#ffffff';

/** Maximum image dimension before resize (in pixels) */
export const MAX_IMAGE_DIMENSION = 4000;
