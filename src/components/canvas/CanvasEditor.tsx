import { useRef } from 'react';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';
import { useEditorStore } from '../../store/useEditorStore';

interface CanvasEditorProps {
    onActionsReady: (actions: FabricCanvasActions) => void;
}

export default function CanvasEditor({ onActionsReady }: CanvasEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sheetConfig = useEditorStore((s) => s.sheetConfig);
    const settings = useEditorStore((s) => s.settings);
    const actionsReadyRef = useRef(false);

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

    return (
        <div className="flex-1 overflow-auto bg-gray-800 flex items-start justify-center p-8">
            <div
                className="shadow-2xl ring-1 ring-gray-700"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    width: widthPx,
                    height: heightPx,
                }}
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
