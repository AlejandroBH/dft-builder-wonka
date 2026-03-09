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
            <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden relative">
                {/* Left Panel / Mobile Bottom Bar */}
                <div className="flex flex-col md:w-auto shrink-0 bg-gray-900 z-10 md:border-r border-t md:border-t-0 border-gray-700">
                    <LeftPanel canvasActions={canvasActions} />
                    <div className="hidden md:block">
                        <AssetLibrary canvasActions={canvasActions} />
                    </div>
                </div>

                {/* Canvas Area */}
                <CanvasEditor onActionsReady={handleActionsReady} />

                {/* Right Panel (Hidden on small screens) */}
                <div className="hidden lg:flex">
                    <RightPanel />
                </div>
            </div>
        </div>
    );
}
