import { useEditorStore } from '../../store/useEditorStore';
import { exportCanvasAsPng } from '../../utils/exportPng';
import { exportCanvasAsPdf } from '../../utils/exportPdf';
import { SHEET_WIDTHS, SHEET_HEIGHTS } from '../../constants';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';

interface TopToolbarProps {
    canvasActions: FabricCanvasActions | null;
}

export default function TopToolbar({ canvasActions }: TopToolbarProps) {
    const sheetConfig = useEditorStore((s) => s.sheetConfig);
    const setSheetConfig = useEditorStore((s) => s.setSheetConfig);
    const settings = useEditorStore((s) => s.settings);
    const toggleGrid = useEditorStore((s) => s.toggleGrid);
    const toggleSnap = useEditorStore((s) => s.toggleSnap);
    const zoomIn = useEditorStore((s) => s.zoomIn);
    const zoomOut = useEditorStore((s) => s.zoomOut);

    const handleExportPng = () => {
        const canvas = canvasActions?.getCanvas();
        const grid = canvasActions?.getGridGroup() ?? null;
        if (canvas) exportCanvasAsPng(canvas, grid);
    };

    const handleExportPdf = () => {
        const canvas = canvasActions?.getCanvas();
        const grid = canvasActions?.getGridGroup() ?? null;
        if (canvas) exportCanvasAsPdf(canvas, sheetConfig, grid);
    };

    return (
        <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-4 shrink-0 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {/* Logo */}
            <div className="flex items-center gap-2 mr-2 md:mr-4 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                </div>
                <h1 className="text-white font-bold text-lg tracking-tight">DTF Builder</h1>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-gray-700" />

            {/* Sheet size */}
            <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-400">Sheet:</label>
                <select
                    value={sheetConfig.widthCm}
                    onChange={(e) => setSheetConfig({ widthCm: +e.target.value })}
                    className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    {SHEET_WIDTHS.map((w) => (
                        <option key={w} value={w}>{w} cm</option>
                    ))}
                </select>
                <span className="text-gray-500">×</span>
                <select
                    value={sheetConfig.heightCm}
                    onChange={(e) => setSheetConfig({ heightCm: +e.target.value })}
                    className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    {SHEET_HEIGHTS.map((h) => (
                        <option key={h} value={h}>{h} cm</option>
                    ))}
                </select>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-gray-700" />

            {/* Zoom */}
            <div className="flex items-center gap-1 text-sm">
                <button onClick={zoomOut} className="p-1.5 rounded hover:bg-gray-700 text-gray-300 transition-colors" title="Zoom Out">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                </button>
                <span className="text-gray-300 min-w-[3rem] text-center font-mono">{Math.round(settings.zoomLevel * 100)}%</span>
                <button onClick={zoomIn} className="p-1.5 rounded hover:bg-gray-700 text-gray-300 transition-colors" title="Zoom In">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-gray-700" />

            {/* Grid / Snap toggles */}
            <div className="flex items-center gap-1">
                <button
                    onClick={toggleGrid}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-colors ${settings.gridVisible
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                        : 'text-gray-400 hover:bg-gray-700 border border-transparent'
                        }`}
                    title="Toggle Grid"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    Grid
                </button>
                <button
                    onClick={toggleSnap}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-colors ${settings.snapToGrid
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                        : 'text-gray-400 hover:bg-gray-700 border border-transparent'
                        }`}
                    title="Toggle Snap to Grid"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18" />
                    </svg>
                    Snap
                </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Export */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleExportPng}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    PNG
                </button>
                <button
                    onClick={handleExportPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF
                </button>
            </div>
        </header>
    );
}
