import { useEditorStore } from '../../store/useEditorStore';

export default function RightPanel() {
    const selectedObjectInfo = useEditorStore((s) => s.selectedObjectInfo);
    const sheetConfig = useEditorStore((s) => s.sheetConfig);

    const pxScale = sheetConfig.pixelScale;

    return (
        <aside className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col shrink-0 overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700">
                <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Properties</h2>
            </div>

            {selectedObjectInfo ? (
                <div className="p-4 space-y-4">
                    {/* Object name */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Name</label>
                        <p className="text-sm text-gray-200 mt-1 truncate" title={selectedObjectInfo.name}>
                            {selectedObjectInfo.name}
                        </p>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Position</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">X</span>
                                <p className="text-sm text-gray-200 font-mono">{(selectedObjectInfo.x / pxScale).toFixed(1)} cm</p>
                            </div>
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">Y</span>
                                <p className="text-sm text-gray-200 font-mono">{(selectedObjectInfo.y / pxScale).toFixed(1)} cm</p>
                            </div>
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Size</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">W</span>
                                <p className="text-sm text-gray-200 font-mono">{(selectedObjectInfo.width / pxScale).toFixed(1)} cm</p>
                            </div>
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">H</span>
                                <p className="text-sm text-gray-200 font-mono">{(selectedObjectInfo.height / pxScale).toFixed(1)} cm</p>
                            </div>
                        </div>
                    </div>

                    {/* Scale */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Scale</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">X</span>
                                <p className="text-sm text-gray-200 font-mono">{selectedObjectInfo.scaleX}</p>
                            </div>
                            <div className="bg-gray-800 rounded px-2.5 py-1.5">
                                <span className="text-xs text-gray-500">Y</span>
                                <p className="text-sm text-gray-200 font-mono">{selectedObjectInfo.scaleY}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rotation */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Rotation</label>
                        <div className="bg-gray-800 rounded px-2.5 py-1.5 mt-1">
                            <p className="text-sm text-gray-200 font-mono">{selectedObjectInfo.angle}°</p>
                        </div>
                    </div>

                    {/* Lock status */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Status</label>
                        <div className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${selectedObjectInfo.locked
                                ? 'bg-red-900/30 text-red-400 border border-red-700/30'
                                : 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedObjectInfo.locked ? 'bg-red-400' : 'bg-emerald-400'}`} />
                            {selectedObjectInfo.locked ? 'Locked' : 'Unlocked'}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <svg className="w-12 h-12 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                    </svg>
                    <p className="text-gray-500 text-sm">Select an object on the canvas to view its properties</p>
                </div>
            )}

            {/* Sheet info at bottom */}
            <div className="mt-auto border-t border-gray-700 p-4">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sheet Info</h3>
                <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Width</span>
                        <span className="text-gray-300 font-mono">{sheetConfig.widthCm} cm</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Height</span>
                        <span className="text-gray-300 font-mono">{sheetConfig.heightCm} cm</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Resolution</span>
                        <span className="text-gray-300 font-mono">{sheetConfig.widthCm * pxScale} × {sheetConfig.heightCm * pxScale} px</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Scale</span>
                        <span className="text-gray-300 font-mono">1 cm = {pxScale} px</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
