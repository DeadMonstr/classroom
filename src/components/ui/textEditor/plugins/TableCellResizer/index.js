import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import {
    $computeTableMapSkipCellCheck,
    $getTableNodeFromLexicalNodeOrThrow,
    $getTableRowIndexFromTableCellNode,
    $isTableCellNode,
    $isTableRowNode,
    getDOMCellFromTarget,
    getTableElement,
    TableNode,
} from '@lexical/table';
import { calculateZoomLevel, mergeRegister } from '@lexical/utils';
import { $getNearestNodeFromDOMNode, isHTMLElement } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './index.css';

const MIN_ROW_HEIGHT = 33;
const MIN_COLUMN_WIDTH = 92;



function TableCellResizer({ editor }) {
    const targetRef = useRef(null);
    const resizerRef = useRef(null);
    const tableRectRef = useRef(null);
    const [hasTable, setHasTable] = useState(false);
    const mouseStartPosRef = useRef(null);
    const [mouseCurrentPos, updateMouseCurrentPos] = useState(null);
    const [activeCell, updateActiveCell] = useState(null);
    const [isMouseDown, updateIsMouseDown] = useState(false);
    const [draggingDirection, updateDraggingDirection] = useState(null);

    const resetState = useCallback(() => {
        updateActiveCell(null);
        targetRef.current = null;
        updateDraggingDirection(null);
        mouseStartPosRef.current = null;
        tableRectRef.current = null;
    }, []);

    useEffect(() => {
        if (!editor) return;

        const tableKeys = new Set();
        return mergeRegister(
            editor.registerMutationListener(TableNode, (nodeMutations) => {
                for (const [nodeKey, mutation] of nodeMutations) {
                    if (mutation === 'destroyed') {
                        tableKeys.delete(nodeKey);
                    } else {
                        tableKeys.add(nodeKey);
                    }
                }
                setHasTable(tableKeys.size > 0);
            })
        );
    }, [editor]);

    useEffect(() => {
        if (!hasTable) return;

        const onMouseMove = (event) => {
            if (!editor) return;
            const target = event.target;
            if (!isHTMLElement(target)) return;

            if (draggingDirection) {
                updateMouseCurrentPos({ x: event.clientX, y: event.clientY });
                return;
            }

            updateIsMouseDown(event.buttons === 1);
            if (resizerRef.current && resizerRef.current.contains(target)) return;

            if (targetRef.current !== target) {
                targetRef.current = target;
                const cell = getDOMCellFromTarget(target);

                if (cell && activeCell !== cell) {
                    editor.update(() => {
                        const tableCellNode = $getNearestNodeFromDOMNode(cell.elem);
                        if (!tableCellNode) throw new Error('TableCellResizer: Table cell node not found.');
                        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
                        const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()));
                        if (!tableElement) throw new Error('TableCellResizer: Table element not found.');
                        tableRectRef.current = tableElement.getBoundingClientRect();
                        updateActiveCell(cell);
                    });
                } else if (!cell) {
                    resetState();
                }
            }
        };

        const onMouseDown = () => updateIsMouseDown(true);
        const onMouseUp = () => updateIsMouseDown(false);

        const removeRootListener = editor.registerRootListener((rootElement, prevRootElement) => {
            prevRootElement?.removeEventListener('mousemove', onMouseMove);
            prevRootElement?.removeEventListener('mousedown', onMouseDown);
            prevRootElement?.removeEventListener('mouseup', onMouseUp);
            rootElement?.addEventListener('mousemove', onMouseMove);
            rootElement?.addEventListener('mousedown', onMouseDown);
            rootElement?.addEventListener('mouseup', onMouseUp);
        });

        return () => removeRootListener();
    }, [activeCell, draggingDirection, editor, resetState, hasTable]);

    return (
        <div ref={resizerRef}>
            {activeCell != null && !isMouseDown && (
                <>
                    <div
                        className="TableCellResizer__resizer TableCellResizer__ui"
                        style={{ cursor: 'col-resize' }}
                        onMouseDown={() => updateDraggingDirection('right')}
                    />
                    <div
                        className="TableCellResizer__resizer TableCellResizer__ui"
                        style={{ cursor: 'row-resize' }}
                        onMouseDown={() => updateDraggingDirection('bottom')}
                    />
                </>
            )}
        </div>
    );
}

export default function TableCellResizerPlugin() {
    const [editor] = useLexicalComposerContext();
    const isEditable = useLexicalEditable();

    return isEditable ? createPortal(<TableCellResizer editor={editor} />, document.body) : null;
}
