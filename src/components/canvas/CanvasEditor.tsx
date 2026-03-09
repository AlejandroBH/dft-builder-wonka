import { useRef, useState } from 'react';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';
import { useEditorStore } from '../../store/useEditorStore';
import { readImageFile } from '../../utils/imageUpload';

interface CanvasEditorProps {
    onActionsReady: (actions: FabricCanvasActions) => void;
}

export default function CanvasEditor({ onActionsReady }: CanvasEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sheetConfig = useEditorStore((s) => s.sheetConfig);
    const settings = useEditorStore((s) => s.settings);
    const actionsReadyRef = useRef(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const actions = useFabricCanvas(canvasRef);

    // Report actions to parent once
    if (!actionsReadyRef.current && actions) {
        actionsReadyRef.current = true;
        // Use microtask to avoid calling during render
        queueMicrotask(() => onActionsReady(actions));
    }

    const zoom = settings.zoomLevel;
    const widthPx = sheetConfig.widthCm * sheetConfig.pixelScale;
    const heightPx = sheetConfig.heightCm * sheetConfig.pixelScale;

    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true);
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (!actions) return;

        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            try {
                const dataUrl = await readImageFile(file);
                // Assign a clean name without extension
                const cleanName = file.name.replace(/\.[^/.]+$/, "");
                actions.addImage(dataUrl, cleanName);
            } catch (err) {
                console.error('Failed to process dropped image:', err);
            }
        }
    };

    return (
        <div
            className={`flex-1 overflow-auto bg-gray-800 flex items-start justify-center p-8 transition-colors ${isDraggingOver ? 'bg-gray-700/80 ring-2 ring-indigo-500 inset-0 ring-inset' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div
                className="shadow-1xl ring-1 ring-gray-700 pointer-events-auto"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    width: widthPx,
                    height: heightPx,
                }}
            >
                <canvas ref={canvasRef} />
            </div>

            {/* Overlay para visual feedback del drop */}
            {isDraggingOver && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-indigo-900/20 backdrop-blur-sm">
                    <div className="bg-gray-900/90 text-indigo-300 p-6 rounded-2xl shadow-2xl border border-indigo-500/50 flex flex-col items-center gap-3">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="font-semibold text-lg tracking-wide">Suelta tus imágenes aquí</span>
                    </div>
                </div>
            )}
        </div>
    );
}
