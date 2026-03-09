import { useEditorStore } from '../../store/useEditorStore';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';

interface AssetLibraryProps {
    canvasActions: FabricCanvasActions | null;
}

export default function AssetLibrary({ canvasActions }: AssetLibraryProps) {
    const objects = useEditorStore((s) => s.objects);
    const removeObject = useEditorStore((s) => s.removeObject);

    const handleAddToCanvas = (obj: typeof objects[0]) => {
        if (canvasActions && obj.dataUrl) {
            canvasActions.addImage(obj.dataUrl, obj.name);
        }
    };

    const handleRemoveAsset = (id: string) => {
        // Remove from store
        removeObject(id);
        // Note: the canvas object is not removed here — only the asset reference is removed
    };

    if (objects.length === 0) return null;

    return (
        <div className="border-t border-gray-700">
            <div className="px-4 py-3">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider">Uploaded Assets</h3>
            </div>
            <div className="px-3 pb-3 space-y-1.5 max-h-60 overflow-y-auto">
                {objects.map((obj) => (
                    <div
                        key={obj.id}
                        className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 group hover:bg-gray-750 transition-colors"
                    >
                        {/* Thumbnail */}
                        {obj.dataUrl ? (
                            <img
                                src={obj.dataUrl}
                                alt={obj.name}
                                className="w-10 h-10 object-contain rounded bg-gray-700/50 p-0.5"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded bg-gray-700/50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                </svg>
                            </div>
                        )}

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-300 truncate">{obj.name}</p>
                            <p className="text-[10px] text-gray-500">{obj.widthCm} × {obj.heightCm} cm</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleAddToCanvas(obj)}
                                className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-indigo-400 transition-colors"
                                title="Add to canvas"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleRemoveAsset(obj.id)}
                                className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400 transition-colors"
                                title="Remove asset"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
