import React, {useCallback, useEffect, useRef, useState} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';


import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {TRANSFORMERS} from "@lexical/markdown";
import {$generateHtmlFromNodes} from "@lexical/html";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {MarkdownShortcutPlugin} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

import TableCellResizer from './plugins/TableCellResizer';
import ToolbarPlugin from "components/ui/textEditor/plugins/Toolbar";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHightlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import {
    $createNodeSelection, $getNearestNodeFromDOMNode,
    $setSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW
} from "lexical";

import "./textEditor.sass"

import exampleTheme from "./themes/ExampleTheme";
import Button from "components/ui/button";
import {$isMathNode, MathNode} from "./nodes/MathNode";
import {$isWrapperNode, WrapperNode} from "./nodes/WrapperNode";
import {NodeDeletePlugin} from "./plugins/NodeDeletePlugin/NodeDeletePlugin";
import {TableContext} from "components/ui/textEditor/plugins/TablePlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import {TablePlugin} from "@lexical/react/LexicalTablePlugin";


const editorConfig = {
    // The editor theme
    theme: exampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        TableNode,
        TableCellNode,
        TableRowNode,
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        LinkNode,
        MathNode,
        WrapperNode
    ]
};


export function MathClickPlugin({onDoubleClick}) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const findHostElem = (event) => {
            // Prefer composedPath for shadow DOM safety
            const path = typeof event.composedPath === "function" ? event.composedPath() : [];
            for (const el of path) {
                if (!(el instanceof HTMLElement)) continue;
                if (el.classList?.contains("math-node")) return el;             // wrapper span
                if (el.tagName === "MATH-FIELD") return el.closest(".math-node") || el;
                if (el.classList?.contains("wrapper-node")) return el;
            }
            // Fallback when composedPath not available
            const t = event.target;
            return t.closest?.(".math-node, .wrapper-node") || null;
        };

        return editor.registerCommand(
            CLICK_COMMAND,
            (event) => {
                const host = findHostElem(event);
                if (!host) return false;

                // Only take over on modified click (Ctrl/Cmd) or double-click.
                const wantsNodeSelect = event.metaKey || event.ctrlKey || event.detail >= 2;
                if (!wantsNodeSelect) {
                    // Let the default behavior start/extend a range selection.
                    return false;
                }

                // Don't let <math-field> take focus away and block selection
                event.preventDefault();

                let handled = false;

                editor.update(() => {
                    const node = $getNearestNodeFromDOMNode(host);
                    if (!node) return;

                    // Prefer selecting MathNode; otherwise allow selecting its Wrapper
                    if ($isMathNode(node) || $isWrapperNode(node)) {
                        event.preventDefault();
                        const sel = $createNodeSelection();
                        sel.add(node.getKey());
                        $setSelection(sel);
                        handled = true;

                        // Optional: double-click to edit
                        if (onDoubleClick && event.detail >= 2 && $isMathNode(node)) {
                            // Slight delay so selection is visible before opening UI
                            setTimeout(() => onDoubleClick(node), 0);
                        }
                    }
                });

                return handled;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, onDoubleClick]);

    return null;
}

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}


export const CAN_USE_DOM =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';


function extractWrappedMathNodes(editor) {


    let index = 0;
    const words = [];

    const toMarker = (type, text) => {
        if (type === 'matchWord') return `%/${text}/%`;
        if (type === 'wrong') return `$^/${text}/^$`;
        return `?/${text}/?`; // input
    };

    const htmlString = editor.getEditorState().read(() => {
        // Let Lexical do the heavy lifting (tables, headings, formats, etc.)
        return $generateHtmlFromNodes(editor, null);
    });


    // Work in a detached DOM to avoid touching the editor
    const container = document.createElement('div');
    container.innerHTML = htmlString;


    // 1) Replace wrapper nodes with placeholders and collect 'words'
    container.querySelectorAll('.wrapper-node[data-wrapper-type]').forEach((wrapEl) => {

        const type = wrapEl.getAttribute('data-wrapper-type'); // matchWord | wrong | input
        wrapEl.style.border = "none"


        wrapEl.childNodes.forEach((child) => {


            if (child.getAttribute('data-latex')) {
                const mathEl = wrapEl.querySelector('.math-node[data-latex], math-field[data-latex]');
                const latex = mathEl?.getAttribute('data-latex')?.trim();
                const text = (latex ?? wrapEl.textContent ?? '').trim();
                if (!text) {
                    // If empty, just remove wrapper
                    child.replaceWith('');
                    return;
                }

                const placeholder = `{{${++index}}}`;
                words.push({
                    text,
                    wrapped: toMarker(type, text),
                    isMath: !!latex,
                    index,
                    type,
                    statusWord: type === 'wrong' ? 'wrong' : 'correct',
                });

                return child.replaceWith(document.createTextNode(placeholder));
            }


            return child
        })


    });



    const markerRegex = /%\/([^/]+)\/%|\$\^\/([^/]+)\/\^\$|\?\/([^/]+)\/\?/g;
    const finalHtml = container.innerHTML.replace(markerRegex, (_, m1, m2, m3) => {
        const text = (m1 ?? m2 ?? m3) || '';
        const type = m1 || m2 ? 'matchWord'  : 'input';
        const placeholder = `{{${++index}}}`;
        words.push({
            text,
            wrapped: toMarker(type, text),
            isMath: false,
            index,
            type,
            statusWord: type === 'wrong' ? 'wrong' : 'correct',
        });
        return placeholder;
    });


    return {
        text: "<div>" + finalHtml + "</div>",  // full HTML with placeholders inserted
        words,            // collected placeholder map
    };

}

function MyOnSubmitPlugin({onSubmit}) {
    const [editor] = useLexicalComposerContext();


    const onSubmitChanges = useCallback(() => {
        editor.update(() => {


            const htmlString = $generateHtmlFromNodes(editor, null);
            const editorState = editor.getEditorState();
            const {text, words} = extractWrappedMathNodes(editor);


            const data = {
                text,
                editorState: editorState.toJSON(),
                words,
            };


            onSubmit(data)
        });
    }, [editor]);

    return (
        <Button type={"submit"} onClick={onSubmitChanges}>Tasdiqlash</Button>
    )
}


function OnSetEditorState({oldEditorState}) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (oldEditorState) {
            const editorState = editor.parseEditorState(oldEditorState)
            editor.setEditorState(editorState);
        }
    }, [oldEditorState])


    return null
}


const TextEditor = ({onSubmit, options, editorState, text}) => {


    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
    const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    useEffect(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport =
                CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };
        updateViewPortWidth();
        window.addEventListener('resize', updateViewPortWidth);
        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);


    return (
        <LexicalComposer initialConfig={editorConfig}>
            <TableContext>
                <div className={"editor"}>
                    <div className="editor-container">
                        <ToolbarPlugin options={options}/>
                        <div className="editor-inner">
                            <RichTextPlugin
                                contentEditable={
                                    <div ref={onRef}>
                                        <ContentEditable className="editor-input"/>
                                    </div>
                                }
                                placeholder={<Placeholder/>}
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <TablePlugin
                                hasTabHandler={false}
                                hasCellMerge={true}
                                hasCellBackgroundColor={true}
                                hasHorizontalScroll={true}
                            />
                            <TableCellResizer/>
                            <NodeDeletePlugin/>

                            <MathClickPlugin/>
                            <HistoryPlugin/>
                            <AutoFocusPlugin/>
                            <CodeHighlightPlugin/>
                            <ListPlugin/>
                            <LinkPlugin/>
                            <AutoLinkPlugin/>
                            <ListMaxIndentLevelPlugin maxDepth={7}/>
                            <MarkdownShortcutPlugin transformers={TRANSFORMERS}/>
                            <OnSetEditorState text={text} oldEditorState={editorState}/>
                            {floatingAnchorElem && (
                                <>
                                    <TableCellActionMenuPlugin
                                        anchorElem={floatingAnchorElem}
                                        cellMerge={true}
                                    />
                                </>
                            )}

                        </div>
                        <MyOnSubmitPlugin onSubmit={onSubmit}/>
                    </div>
                </div>
            </TableContext>

        </LexicalComposer>
    );
};
export default TextEditor;