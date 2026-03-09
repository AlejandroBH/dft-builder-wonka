import { useRef, useCallback } from 'react';
import { readImageFile } from '../../utils/imageUpload';
import { useEditorStore } from '../../store/useEditorStore';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';

interface LeftPanelProps {
    canvasActions: FabricCanvasActions | null;
}

export default function LeftPanel({ canvasActions }: LeftPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedObjectInfo = useEditorStore((s) => s.selectedObjectInfo);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length || !canvasActions) return;

        for (const file of Array.from(files)) {
            try {
                const dataUrl = await readImageFile(file);
                canvasActions.addImage(dataUrl, file.name);
            } catch (err) {
                console.error('Failed to upload image:', err);
            }
        }
        // Reset so user can upload same file again
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [canvasActions]);

    const hasSelection = !!selectedObjectInfo;
    const isLocked = selectedObjectInfo?.locked ?? false;

    const tools = [
        {
            label: 'Upload',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
            ),
            onClick: () => fileInputRef.current?.click(),
            enabled: true,
            accent: true,
        },
        {
            label: 'Duplicate',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m0 0a2.625 2.625 0 113.261 2.548m-3.261-2.548a2.625 2.625 0 01-.261-1.125" />
                </svg>
            ),
            onClick: () => canvasActions?.duplicateSelected(),
            enabled: hasSelection,
        },
        {
            label: 'Delete',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            ),
            onClick: () => canvasActions?.deleteSelected(),
            enabled: hasSelection,
            danger: true,
        },
        {
            label: isLocked ? 'Unlock' : 'Lock',
            icon: isLocked ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            ),
            onClick: () => canvasActions?.lockSelected(),
            enabled: hasSelection,
        },
        {
            label: 'Forward',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                </svg>
            ),
            onClick: () => canvasActions?.bringForward(),
            enabled: hasSelection,
        },
        {
            label: 'Backward',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                </svg>
            ),
            onClick: () => canvasActions?.sendBackward(),
            enabled: hasSelection,
        },
    ];

    return (
        <aside className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-3 gap-1 shrink-0">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
            />

            {tools.map((tool) => (
                <button
                    key={tool.label}
                    onClick={tool.onClick}
                    disabled={!tool.enabled}
                    title={tool.label}
                    className={`
            w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150
            ${!tool.enabled
                            ? 'text-gray-600 cursor-not-allowed'
                            : tool.accent
                                ? 'text-indigo-400 hover:bg-indigo-600/20 hover:text-indigo-300'
                                : tool.danger
                                    ? 'text-gray-400 hover:bg-red-600/20 hover:text-red-400'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }
          `}
                >
                    {tool.icon}
                    <span className="text-[10px] leading-none">{tool.label}</span>
                </button>
            ))}
        </aside>
    );
}
