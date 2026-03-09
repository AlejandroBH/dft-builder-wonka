import { create } from 'zustand';
import type { SheetConfig, CanvasObjectData, SelectedObjectInfo, EditorSettings } from '../types';
import { DEFAULT_SHEET_CONFIG, DEFAULT_EDITOR_SETTINGS, MIN_ZOOM, MAX_ZOOM } from '../constants';

interface EditorState {
    // Sheet config
    sheetConfig: SheetConfig;
    setSheetConfig: (config: Partial<SheetConfig>) => void;

    // Objects
    objects: CanvasObjectData[];
    addObject: (obj: CanvasObjectData) => void;
    removeObject: (id: string) => void;
    clearObjects: () => void;

    // Selection
    selectedObjectInfo: SelectedObjectInfo | null;
    setSelectedObjectInfo: (info: SelectedObjectInfo | null) => void;

    // Editor settings
    settings: EditorSettings;
    toggleGrid: () => void;
    toggleSnap: () => void;
    setZoom: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    // Sheet config
    sheetConfig: DEFAULT_SHEET_CONFIG,
    setSheetConfig: (config) =>
        set((state) => ({
            sheetConfig: { ...state.sheetConfig, ...config },
        })),

    // Objects
    objects: [],
    addObject: (obj) =>
        set((state) => ({
            objects: [...state.objects, obj],
        })),
    removeObject: (id) =>
        set((state) => ({
            objects: state.objects.filter((o) => o.id !== id),
        })),
    clearObjects: () => set({ objects: [] }),

    // Selection
    selectedObjectInfo: null,
    setSelectedObjectInfo: (info) => set({ selectedObjectInfo: info }),

    // Editor settings
    settings: DEFAULT_EDITOR_SETTINGS,
    toggleGrid: () =>
        set((state) => ({
            settings: { ...state.settings, gridVisible: !state.settings.gridVisible },
        })),
    toggleSnap: () =>
        set((state) => ({
            settings: { ...state.settings, snapToGrid: !state.settings.snapToGrid },
        })),
    setZoom: (zoom) =>
        set((state) => ({
            settings: {
                ...state.settings,
                zoomLevel: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)),
            },
        })),
    zoomIn: () => {
        const current = get().settings.zoomLevel;
        get().setZoom(current + 0.25);
    },
    zoomOut: () => {
        const current = get().settings.zoomLevel;
        get().setZoom(current - 0.25);
    },
}));
