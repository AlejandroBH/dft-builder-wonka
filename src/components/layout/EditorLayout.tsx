import { useState, useCallback } from 'react';
import TopToolbar from '../toolbar/TopToolbar';
import LeftPanel from '../sidebar/LeftPanel';
import RightPanel from '../sidebar/RightPanel';
import AssetLibrary from '../sidebar/AssetLibrary';
import CanvasEditor from '../canvas/CanvasEditor';
import type { FabricCanvasActions } from '../../hooks/useFabricCanvas';

export default function EditorLayout() {
    const [canvasActions, setCanvasActions] = useState<FabricCanvasActions | null>(null);

    const handleActionsReady = useCallback((actions: FabricCanvasActions) => {
        setCanvasActions(actions);
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
            {/* Top Toolbar */}
            <TopToolbar canvasActions={canvasActions} />

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="flex flex-col">
                    <LeftPanel canvasActions={canvasActions} />
                    <AssetLibrary canvasActions={canvasActions} />
                </div>

                {/* Canvas Area */}
                <CanvasEditor onActionsReady={handleActionsReady} />

                {/* Right Panel */}
                <RightPanel />
            </div>
        </div>
    );
}
