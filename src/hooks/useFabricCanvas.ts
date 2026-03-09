import { useRef, useCallback, useEffect } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/useEditorStore';
import { createGridGroup } from '../components/canvas/GridOverlay';
import { generateId } from '../utils/imageUpload';
import type { SelectedObjectInfo } from '../types';

export interface FabricCanvasActions {
    addImage: (dataUrl: string, name: string) => void;
    deleteSelected: () => void;
    duplicateSelected: () => void;
    bringForward: () => void;
    sendBackward: () => void;
    lockSelected: () => void;
    getCanvas: () => fabric.Canvas | null;
    getGridGroup: () => fabric.Group | null;
}

export function useFabricCanvas(canvasElRef: React.RefObject<HTMLCanvasElement | null>) {
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const gridGroupRef = useRef<fabric.Group | null>(null);

    const sheetConfig = useEditorStore((s) => s.sheetConfig);
    const settings = useEditorStore((s) => s.settings);
    const addObject = useEditorStore((s) => s.addObject);
    const removeObject = useEditorStore((s) => s.removeObject);
    const setSelectedObjectInfo = useEditorStore((s) => s.setSelectedObjectInfo);

    // Extract selection info from a fabric object
    const extractObjectInfo = useCallback((obj: fabric.FabricObject): SelectedObjectInfo => {
        const bound = obj.getBoundingRect();
        return {
            id: (obj as fabric.FabricObject & { objectId?: string }).objectId || '',
            name: (obj as fabric.FabricObject & { objectName?: string }).objectName || 'Object',
            x: Math.round(obj.left ?? 0),
            y: Math.round(obj.top ?? 0),
            width: Math.round(bound.width),
            height: Math.round(bound.height),
            scaleX: +(obj.scaleX ?? 1).toFixed(3),
            scaleY: +(obj.scaleY ?? 1).toFixed(3),
            angle: Math.round(obj.angle ?? 0),
            locked: obj.lockMovementX ?? false,
        };
    }, []);

    // Sync selection state
    const syncSelection = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active && (active as fabric.FabricObject & { objectId?: string }).objectId) {
            setSelectedObjectInfo(extractObjectInfo(active));
        } else {
            setSelectedObjectInfo(null);
        }
    }, [setSelectedObjectInfo, extractObjectInfo]);

    // Initialize canvas
    useEffect(() => {
        const el = canvasElRef.current;
        if (!el || fabricCanvasRef.current) return;

        const widthPx = sheetConfig.widthCm * sheetConfig.pixelScale;
        const heightPx = sheetConfig.heightCm * sheetConfig.pixelScale;

        const canvas = new fabric.Canvas(el, {
            width: widthPx,
            height: heightPx,
            backgroundColor: 'transparent',
            selection: true,
            preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        // Create grid
        const gridSizePx = settings.gridSizeCm * sheetConfig.pixelScale;
        const gridGroup = createGridGroup(widthPx, heightPx, gridSizePx);
        gridGroup.visible = settings.gridVisible;
        canvas.add(gridGroup);
        canvas.sendObjectToBack(gridGroup);
        gridGroupRef.current = gridGroup;

        // Event listeners
        canvas.on('selection:created', syncSelection);
        canvas.on('selection:updated', syncSelection);
        canvas.on('selection:cleared', () => setSelectedObjectInfo(null));
        canvas.on('object:modified', syncSelection);

        // Snap to grid on moving
        canvas.on('object:moving', (e) => {
            if (!useEditorStore.getState().settings.snapToGrid) return;
            const obj = e.target;
            if (!obj) return;
            const grid = useEditorStore.getState().settings.gridSizeCm * useEditorStore.getState().sheetConfig.pixelScale;
            obj.set({
                left: Math.round((obj.left ?? 0) / grid) * grid,
                top: Math.round((obj.top ?? 0) / grid) * grid,
            });
        });

        return () => {
            canvas.dispose();
            fabricCanvasRef.current = null;
            gridGroupRef.current = null;
        };
        // We only want to initialize once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update canvas size when sheet config changes
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const widthPx = sheetConfig.widthCm * sheetConfig.pixelScale;
        const heightPx = sheetConfig.heightCm * sheetConfig.pixelScale;

        canvas.setDimensions({ width: widthPx, height: heightPx });

        // Recreate grid
        if (gridGroupRef.current) {
            canvas.remove(gridGroupRef.current);
        }
        const gridSizePx = settings.gridSizeCm * sheetConfig.pixelScale;
        const gridGroup = createGridGroup(widthPx, heightPx, gridSizePx);
        gridGroup.visible = settings.gridVisible;
        canvas.add(gridGroup);
        canvas.sendObjectToBack(gridGroup);
        gridGroupRef.current = gridGroup;
        canvas.renderAll();
    }, [sheetConfig.widthCm, sheetConfig.heightCm, sheetConfig.pixelScale, settings.gridSizeCm, settings.gridVisible]);

    // Update grid visibility
    useEffect(() => {
        if (gridGroupRef.current) {
            gridGroupRef.current.visible = settings.gridVisible;
            fabricCanvasRef.current?.renderAll();
        }
    }, [settings.gridVisible]);

    // Actions
    const addImage = useCallback(
        (dataUrl: string, name: string) => {
            const canvas = fabricCanvasRef.current;
            if (!canvas) return;

            const imgEl = new Image();
            imgEl.onload = () => {
                const fabricImg = new fabric.FabricImage(imgEl, {
                    left: 20,
                    top: 20,
                });

                // Scale image to fit within sheet if too large
                const maxW = canvas.width! * 0.8;
                const maxH = canvas.height! * 0.6;
                if (fabricImg.width! > maxW || fabricImg.height! > maxH) {
                    const scale = Math.min(maxW / fabricImg.width!, maxH / fabricImg.height!);
                    fabricImg.scaleToWidth(fabricImg.width! * scale);
                }

                const id = generateId();
                (fabricImg as fabric.FabricObject & { objectId?: string }).objectId = id;
                (fabricImg as fabric.FabricObject & { objectName?: string }).objectName = name;

                // Set corner styling
                fabricImg.set({
                    cornerColor: '#6366f1',
                    cornerStrokeColor: '#4f46e5',
                    cornerStyle: 'circle',
                    cornerSize: 10,
                    transparentCorners: false,
                    borderColor: '#6366f1',
                    borderScaleFactor: 2,
                });

                canvas.add(fabricImg);
                canvas.setActiveObject(fabricImg);
                canvas.renderAll();

                // Add to store
                const bound = fabricImg.getBoundingRect();
                addObject({
                    id,
                    name,
                    dataUrl,
                    widthCm: +(bound.width / sheetConfig.pixelScale).toFixed(1),
                    heightCm: +(bound.height / sheetConfig.pixelScale).toFixed(1),
                });

                syncSelection();
            };
            imgEl.src = dataUrl;
        },
        [addObject, sheetConfig.pixelScale, syncSelection]
    );

    const deleteSelected = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        const id = (active as fabric.FabricObject & { objectId?: string }).objectId;
        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.renderAll();
        if (id) removeObject(id);
        setSelectedObjectInfo(null);
    }, [removeObject, setSelectedObjectInfo]);

    const duplicateSelected = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;

        active.clone().then((cloned: fabric.FabricObject) => {
            const newId = generateId();
            cloned.set({
                left: (active.left ?? 0) + 20,
                top: (active.top ?? 0) + 20,
            });
            (cloned as fabric.FabricObject & { objectId?: string }).objectId = newId;
            const origName = (active as fabric.FabricObject & { objectName?: string }).objectName || 'Object';
            (cloned as fabric.FabricObject & { objectName?: string }).objectName = origName + ' (copy)';

            cloned.set({
                cornerColor: '#6366f1',
                cornerStrokeColor: '#4f46e5',
                cornerStyle: 'circle',
                cornerSize: 10,
                transparentCorners: false,
                borderColor: '#6366f1',
                borderScaleFactor: 2,
            });

            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();

            const bound = cloned.getBoundingRect();
            addObject({
                id: newId,
                name: origName + ' (copy)',
                dataUrl: '',
                widthCm: +(bound.width / sheetConfig.pixelScale).toFixed(1),
                heightCm: +(bound.height / sheetConfig.pixelScale).toFixed(1),
            });

            syncSelection();
        });
    }, [addObject, sheetConfig.pixelScale, syncSelection]);

    const bringForward = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        canvas.bringObjectForward(active);
        canvas.renderAll();
    }, []);

    const sendBackward = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        canvas.sendObjectBackwards(active);
        // Ensure grid stays at back
        if (gridGroupRef.current) {
            canvas.sendObjectToBack(gridGroupRef.current);
        }
        canvas.renderAll();
    }, []);

    const lockSelected = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        const isLocked = active.lockMovementX;
        active.set({
            lockMovementX: !isLocked,
            lockMovementY: !isLocked,
            lockRotation: !isLocked,
            lockScalingX: !isLocked,
            lockScalingY: !isLocked,
            hasControls: isLocked,
            borderColor: !isLocked ? '#ef4444' : '#6366f1',
        });
        canvas.renderAll();
        syncSelection();
    }, [syncSelection]);

    const actions: FabricCanvasActions = {
        addImage,
        deleteSelected,
        duplicateSelected,
        bringForward,
        sendBackward,
        lockSelected,
        getCanvas: () => fabricCanvasRef.current,
        getGridGroup: () => gridGroupRef.current,
    };

    return actions;
}
