import * as fabric from 'fabric';
import { GRID_LINE_COLOR, GRID_MAJOR_LINE_COLOR } from '../../constants';

/**
 * Create grid lines as a Fabric Group.
 * Grid is non-selectable and rendered behind objects.
 */
export function createGridGroup(
    widthPx: number,
    heightPx: number,
    gridSizePx: number
): fabric.Group {
    const lines: fabric.FabricObject[] = [];

    // Vertical lines
    for (let x = 0; x <= widthPx; x += gridSizePx) {
        const isMajor = x % (gridSizePx * 5) === 0;
        lines.push(
            new fabric.Line([x, 0, x, heightPx], {
                stroke: isMajor ? GRID_MAJOR_LINE_COLOR : GRID_LINE_COLOR,
                strokeWidth: isMajor ? 0.8 : 0.4,
                selectable: false,
                evented: false,
            })
        );
    }

    // Horizontal lines
    for (let y = 0; y <= heightPx; y += gridSizePx) {
        const isMajor = y % (gridSizePx * 5) === 0;
        lines.push(
            new fabric.Line([0, y, widthPx, y], {
                stroke: isMajor ? GRID_MAJOR_LINE_COLOR : GRID_LINE_COLOR,
                strokeWidth: isMajor ? 0.8 : 0.4,
                selectable: false,
                evented: false,
            })
        );
    }

    const group = new fabric.Group(lines, {
        selectable: false,
        evented: false,
        objectCaching: true,
    });

    return group;
}
