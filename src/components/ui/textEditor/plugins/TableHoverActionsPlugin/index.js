// plugins/TableHoverActionsPlugin.js
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {
    $getTableAndElementByKey,
    $getTableColumnIndexFromTableCellNode,
    $getTableRowIndexFromTableCellNode,
    $insertTableColumn,
    $insertTableRow,
    $isTableCellNode,
    $isTableNode,
    getTableElement,
    TableNode,
} from '@lexical/table';
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import {$getNearestNodeFromDOMNode, isHTMLElement} from 'lexical';

const BUTTON_WIDTH_PX = 20;

/* Helpers */
function getThemeSelector(getTheme, name) {
    const className = getTheme()?.[name];
    if (typeof className !== 'string') {
        throw new Error(`getThemeSelector: required theme property ${String(name)} not defined`);
    }
    return className
        .split(/\s+/g)
        .map((cls) => `.${cls}`)
        .join('');
}

function useDebounce(fn, ms, maxWait) {
    const funcRef = useRef(fn);
    const timerRef = useRef(null);
    const startRef = useRef(null);

    useEffect(() => { funcRef.current = fn; }, [fn]);
    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return useMemo(() => {
        return (...args) => {
            const now = Date.now();
            if (!startRef.current) startRef.current = now;

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                startRef.current = null;
                timerRef.current = null;
                if (funcRef.current) funcRef.current(...args);
            }, ms);

            if (maxWait && now - startRef.current >= maxWait) {
                startRef.current = null;
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                if (funcRef.current) funcRef.current(...args);
            }
        };
    }, [ms, maxWait]);
}

function getMouseInfo(event, getTheme) {
    const target = event.target;
    const tableCellClass = getThemeSelector(getTheme, 'tableCell');
    if (!isHTMLElement(target)) return {isOutside: true, tableDOMNode: null};

    const tableDOMNode = target.closest(`td${tableCellClass}, th${tableCellClass}`);

    const isOutside = !(
        tableDOMNode ||
        target.closest(`button${getThemeSelector(getTheme, 'tableAddRows')}`) ||
        target.closest(`button${getThemeSelector(getTheme, 'tableAddColumns')}`) ||
        target.closest('div.TableCellResizer__resizer')
    );

    return {isOutside, tableDOMNode};
}

function TableHoverActionsContainer({anchorElem}) {
    const [editor, {getTheme}] = useLexicalComposerContext();
    const isEditable = useLexicalEditable();

    const [isShownRow, setShownRow] = useState(false);
    const [isShownColumn, setShownColumn] = useState(false);
    const [shouldListenMouseMove, setShouldListenMouseMove] = useState(false);
    const [position, setPosition] = useState({});
    const tableSetRef = useRef(new Set());
    const tableCellDOMNodeRef = useRef(null);

    const debouncedOnMouseMove = useDebounce(
        (event) => {
            if (!editor.getRootElement()) return;

            const {isOutside, tableDOMNode} = getMouseInfo(event, getTheme);
            if (isOutside) {
                setShownRow(false);
                setShownColumn(false);
                return;
            }
            if (!tableDOMNode) return;

            tableCellDOMNodeRef.current = tableDOMNode;

            let hoveredRowNode = null;
            let hoveredColumnNode = null;
            let tableDOMElement = null;

            // READ
            editor.read(() => {
                const maybeTableCell = $getNearestNodeFromDOMNode(tableDOMNode);
                if ($isTableCellNode(maybeTableCell)) {
                    const table = $findMatchingParent(maybeTableCell, (node) => $isTableNode(node));
                    if (!$isTableNode(table)) return;

                    tableDOMElement = getTableElement(
                        table,
                        editor.getElementByKey(table.getKey())
                    );
                    if (!tableDOMElement) return;

                    const rowCount = table.getChildrenSize();
                    const firstRow = table.getChildAtIndex(0);
                    const colCount = firstRow ? firstRow.getChildrenSize() : 0;

                    const rowIndex = $getTableRowIndexFromTableCellNode(maybeTableCell);
                    const colIndex = $getTableColumnIndexFromTableCellNode(maybeTableCell);

                    if (rowIndex === rowCount - 1) {
                        hoveredRowNode = maybeTableCell;
                    } else if (colIndex === colCount - 1) {
                        hoveredColumnNode = maybeTableCell;
                    }
                }
            });

            if (tableDOMElement) {
                const {
                    width: tableElemWidth,
                    y: tableElemY,
                    right: tableElemRight,
                    left: tableElemLeft,
                    bottom: tableElemBottom,
                    height: tableElemHeight,
                } = tableDOMElement.getBoundingClientRect();

                const parentElement = tableDOMElement.parentElement;
                let tableHasScroll = false;
                if (
                    parentElement &&
                    parentElement.classList.contains('PlaygroundEditorTheme__tableScrollableWrapper')
                ) {
                    tableHasScroll = parentElement.scrollWidth > parentElement.clientWidth;
                }

                const {y: editorElemY, left: editorElemLeft} = anchorElem.getBoundingClientRect();

                if (hoveredRowNode) {
                    setShownColumn(false);
                    setShownRow(true);
                    setPosition({
                        height: BUTTON_WIDTH_PX,
                        left: tableHasScroll && parentElement
                            ? parentElement.offsetLeft
                            : tableElemLeft - editorElemLeft,
                        top: tableElemBottom - editorElemY + 5,
                        width: tableHasScroll && parentElement
                            ? parentElement.offsetWidth
                            : tableElemWidth,
                    });
                } else if (hoveredColumnNode) {
                    setShownColumn(true);
                    setShownRow(false);
                    setPosition({
                        height: tableElemHeight,
                        left: tableElemRight - editorElemLeft + 5,
                        top: tableElemY - editorElemY,
                        width: BUTTON_WIDTH_PX,
                    });
                } else {
                    setShownRow(false);
                    setShownColumn(false);
                }
            }
        },
        50,
        250
    );

    // hide buttons on table resize
    const tableResizeObserver = useMemo(() => {
        return new ResizeObserver(() => {
            setShownRow(false);
            setShownColumn(false);
        });
    }, []);

    useEffect(() => {
        if (!shouldListenMouseMove) return;
        document.addEventListener('mousemove', debouncedOnMouseMove);
        return () => {
            setShownRow(false);
            setShownColumn(false);
            if (debouncedOnMouseMove.cancel) debouncedOnMouseMove.cancel();
            document.removeEventListener('mousemove', debouncedOnMouseMove);
        };
    }, [shouldListenMouseMove, debouncedOnMouseMove]);

    useEffect(() => {
        return mergeRegister(
            editor.registerMutationListener(
                TableNode,
                (mutations) => {
                    // READ
                    editor.read(() => {
                        let resetObserver = false;
                        for (const [key, type] of mutations) {
                            if (type === 'created') {
                                tableSetRef.current.add(key);
                                resetObserver = true;
                            } else if (type === 'destroyed') {
                                tableSetRef.current.delete(key);
                                resetObserver = true;
                            }
                        }
                        if (resetObserver) {
                            tableResizeObserver.disconnect();
                            for (const tableKey of tableSetRef.current) {
                                const {tableElement} = $getTableAndElementByKey(tableKey);
                                tableResizeObserver.observe(tableElement);
                            }
                            setShouldListenMouseMove(tableSetRef.current.size > 0);
                        }
                    });
                },
                {skipInitialization: false}
            )
        );
    }, [editor, tableResizeObserver]);

    const insertAction = (insertRow) => {
        // WRITE
        editor.update(() => {
            if (!tableCellDOMNodeRef.current) return;
            const maybeCell = $getNearestNodeFromDOMNode(tableCellDOMNodeRef.current);
            maybeCell?.selectEnd();
            if (insertRow) {
                $insertTableRow();
                setShownRow(false);
            } else {
                $insertTableColumn();
                setShownColumn(false);
            }
        });
    };

    if (!isEditable) return null;

    return (
        <>
            {isShownRow && (
                <button
                    className={`${getTheme()?.tableAddRows}`}
                    style={{...position}}
                    onClick={() => insertAction(true)}
                />
            )}
            {isShownColumn && (
                <button
                    className={`${getTheme()?.tableAddColumns}`}
                    style={{...position}}
                    onClick={() => insertAction(false)}
                />
            )}
        </>
    );
}

export default function TableHoverActionsPlugin({anchorElem = document.body}) {
    const isEditable = useLexicalEditable();

    console.log("hello      oooooooooooooooooooooooooooooo  ")

    return isEditable
        ? createPortal(<TableHoverActionsContainer anchorElem={anchorElem} />, anchorElem)
        : null;
}
