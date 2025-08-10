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
// import TableCellActionMenuPlugin from 'components/ui/textEditor/plugins/TableActionMenuPlugin';
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


// export function MathClickPlugin() {
//     const [editor] = useLexicalComposerContext();
//
//     useEffect(() => {
//         return editor.registerCommand(
//             CLICK_COMMAND,
//             (event) => {
//                 const target = event.target.closest(".math-node");
//                 if (target) {
//                     editor.update(() => {
//                         const node = $getNearestNodeFromDOMNode(target); // ✅ get node directly
//                         if (node && $isMathNode(node)) {
//                             const selection = $createNodeSelection();
//                             selection.add(node.getKey());
//                             $setSelection(selection);
//                         }
//                     });
//                     return true;
//                 }
//                 return false;
//             },
//             COMMAND_PRIORITY_LOW
//         );
//     }, [editor]);
//
//
//     return null;
// }

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
    // let index = 0;
    // const words = [];
    // const highlightedParagraphs = [];
    //
    // editor.getEditorState().read(() => {
    //     const root = $getRoot();
    //     const children = root.getChildren();
    //
    //     children.forEach((blockNode) => {
    //         if ($isElementNode(blockNode)) {
    //             const paragraphContent = [];
    //
    //             const recursiveExtract = (node, type = "") => {
    //                 if ($isWrapperNode(node)) {
    //                     const wrapperType = node.__wrapperType;
    //                     const nonMathChild = node.getChildren()
    //                     nonMathChild.forEach((child) => recursiveExtract(child, wrapperType));
    //                 } else if ($isMathNode(node)) {
    //                     const latex = node.__latex;
    //
    //                     if (type === "matchWord" || type === "wrong") {
    //                         const placeholder = `{{${++index}}}`;
    //                         const symbol =
    //                             type === "matchWord"
    //                                 ? "%/"
    //                                 : type === "wrong"
    //                                     ? "$^/"
    //                                     : "?/";
    //                         const closing = type === "wrong" ? "/^$" : "/?";
    //
    //                         words.push({
    //                             text: latex,
    //                             wrapped: `${symbol}${latex}${closing}`,
    //                             isMath: true,
    //                             index,
    //                             type: type,
    //                             statusWord: type === "wrong" ? "wrong" : "correct",
    //                         });
    //
    //                         paragraphContent.push(placeholder);
    //                     } else {
    //                         const mathHTML = `<span style="display: inline-flex;" class="math-node">
    //                               <math-field style="width: fit-content; height: fit-content; display: inline-flex; background-color: white; color: black" readonly>
    //                                 ${latex}
    //                               </math-field>
    //                             </span>`;
    //                         paragraphContent.push(mathHTML);
    //                     }
    //
    //                 } else if ($isTextNode(node)) {
    //                     const text = node.getTextContent();
    //                     const regex = /%\/[^/]+\/%|\$\^\/[^/]+\/\^\$|\?\/[^/]+\/\?/g;
    //                     let lastIndex = 0;
    //                     let match;
    //
    //                     while ((match = regex.exec(text)) !== null) {
    //                         const matched = match[0];
    //                         const start = match.index;
    //
    //                         // Push text before match
    //                         if (start > lastIndex) {
    //                             paragraphContent.push(text.slice(lastIndex, start));
    //                         }
    //
    //                         const placeholder = `{{${++index}}}`;
    //                         const type = matched.startsWith("%/")
    //                             ? "matchWord"
    //                             : "input";
    //
    //                         words.push({
    //                             text: matched.match(/[^/]+/g)[1],
    //                             wrapped: matched,
    //                             index,
    //                             type,
    //                             statusWord: type === "wrong" ? "wrong" : "correct",
    //                         });
    //
    //                         paragraphContent.push(placeholder);
    //                         lastIndex = regex.lastIndex;
    //                     }
    //
    //                     // Push remaining text
    //                     if (lastIndex < text.length) {
    //                         paragraphContent.push(text.slice(lastIndex));
    //                     }
    //                 } else if ($isElementNode(node)) {
    //                     node.getChildren().forEach(recursiveExtract);
    //                 }
    //             }
    //
    //             recursiveExtract(blockNode)
    //
    //             const paragraphText = paragraphContent.join("");
    //             highlightedParagraphs.push(
    //                 `<p class="editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">${paragraphText}</span></p>`
    //             );
    //         }
    //     });
    // });
    //
    //
    // return {
    //     text: highlightedParagraphs.join(""),
    //
    //     words,
    // };
    //
    // let index = 0;
    // const words = [];
    // const highlightedParagraphs = [];
    //
    // // --- helpers -------------------------------------------------
    // const escapeHtml = (s) =>
    //     s.replace(/&/g, "&amp;")
    //         .replace(/</g, "&lt;")
    //         .replace(/>/g, "&gt;");
    //
    // // serialize children of any element node into an HTML string
    // const serializeChildren = (node, inheritedType = "") => {
    //     const parts = [];
    //     node.getChildren().forEach((child) => {
    //         parts.push(serializeNode(child, inheritedType));
    //     });
    //     return parts.join("");
    // };
    //
    // // main serializer
    // const serializeNode = (node, inheritedType = "") => {
    //     // Wrapper: propagate its type to descendants (your rule)
    //     if ($isWrapperNode(node)) {
    //         const wrapperType = node.__wrapperType;
    //         return serializeChildren(node, wrapperType);
    //     }
    //
    //     // Math
    //     if ($isMathNode(node)) {
    //         const latex = node.__latex;
    //         if (inheritedType === "matchWord" || inheritedType === "wrong") {
    //             const placeholder = `{{${++index}}}`;
    //             const symbol = inheritedType === "matchWord" ? "%/" : "$^/";
    //             const closing = inheritedType === "wrong" ? "/^$" : "/?";
    //             words.push({
    //                 text: latex,
    //                 wrapped: `${symbol}${latex}${closing}`,
    //                 isMath: true,
    //                 index,
    //                 type: inheritedType,
    //                 statusWord: inheritedType === "wrong" ? "wrong" : "correct",
    //             });
    //             return placeholder;
    //         }
    //         // export inline math as HTML (NOT JSX)
    //         return `
    //     <span class="math-node" style="display:inline-flex;">
    //       <math-field readonly style="width:fit-content;height:fit-content;display:inline-flex;background-color:white;color:black;">
    //         ${escapeHtml(latex)}
    //       </math-field>
    //     </span>
    //   `;
    //     }
    //
    //     // Text: replace tokens with placeholders, keep the rest as text
    //     if ($isTextNode(node)) {
    //         const text = node.getTextContent();
    //         const regex = /%\/[^/]+\/%|\$\^\/[^/]+\/\^\$|\?\/[^/]+\/\?/g;
    //         let lastIndex = 0;
    //         let out = "";
    //         let m;
    //         while ((m = regex.exec(text)) !== null) {
    //             const start = m.index;
    //             if (start > lastIndex) out += escapeHtml(text.slice(lastIndex, start));
    //             const matched = m[0];
    //             const placeholder = `{{${++index}}}`;
    //             const t = matched.startsWith("%/") ? "matchWord" : "input";
    //             words.push({
    //                 text: matched.match(/[^/]+/g)[1],
    //                 wrapped: matched,
    //                 index,
    //                 type: t,
    //                 statusWord: t === "wrong" ? "wrong" : "correct",
    //             });
    //             out += placeholder;
    //             lastIndex = regex.lastIndex;
    //         }
    //         if (lastIndex < text.length) out += escapeHtml(text.slice(lastIndex));
    //         return out;
    //     }
    //
    //     if ($isTableNode(node)) {
    //         const rowsHtml = node.getChildren().map((row) => serializeNode(row, inheritedType)).join("");
    //         return `<table class="editor-table">${rowsHtml}</table>`;
    //     }
    //
    //     if ($isTableRowNode?.(node)) {
    //         const cellsHtml = node.getChildren().map((cell) => serializeNode(cell, inheritedType)).join("");
    //         return `<tr>${cellsHtml}</tr>`;
    //     }
    //
    //     if ($isTableCellNode?.(node)) {
    //         const colspan = node.__colSpan || 1;
    //         const rowspan = node.__rowSpan || 1;
    //         const content = serializeChildren(node, inheritedType);
    //         // You can include background color/etc. from cell format if you store it
    //         return `<td colspan="${colspan}" rowspan="${rowspan}">${content || ""}</td>`;
    //     }
    //
    //     // Generic element: serialize its children
    //     if ($isElementNode(node)) {
    //         return serializeChildren(node, inheritedType);
    //     }
    //
    //     // Unknown: ignore
    //     return "";
    // };
    // // ------------------------------------------------------------
    //
    // editor.getEditorState().read(() => {
    //     const root = $getRoot();
    //     root.getChildren().forEach((blockNode) => {
    //         if ($isTableNode(blockNode)) {
    //             // Tables are block-level — push as-is
    //             highlightedParagraphs.push(serializeNode(blockNode));
    //         } else if ($isElementNode(blockNode)) {
    //             const html = serializeChildren(blockNode);
    //             highlightedParagraphs.push(
    //                 `<p class="editor-paragraph" dir="ltr"><span style="white-space:pre-wrap;">${html}</span></p>`
    //             );
    //         }
    //     });
    // });
    //
    // return {
    //     text: highlightedParagraphs.join(""),
    //     words,
    // };


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

    console.log(container)


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
            // const htmlString = $generateHtmlFromNodes(editor, null);
            //
            //
            //
            //
            // const editorState = editor.getEditorState();
            // // const inputsRegex = /[\%|\?]\/(.*?)\/[\%|\?]/g;
            // const inputsRegex = /%\/[^\/]+\/%|\$\^\/[^\/]+\/\^\$|\?\/[^\/]+\/\?/g;
            //
            // let isAll = false
            // let index = 0
            //
            // // const inputsRegex = /\?\/(.*?)\/\?/g;
            // // const matchWordsRegex = /\%\/(.*?)\/\%/g;
            // //
            // // console.log(dataText?.text?.match(regex))
            //
            // const matchWordsRegexList = htmlString?.match(inputsRegex)
            // let highlightedText = htmlString
            //
            // const words = matchWordsRegexList?.map((item,index) => {
            //
            //     const type = item.slice(0,2) === "?/" ? "input" : "matchWord"
            //     // const selectedText = item.slice(2,-2)
            //     const selectedText = item.match(/\b\w+\b/g);
            //
            //
            //
            //     // const regex = new RegExp(`[\\%|\\?|\\$^]\\/(${selectedText})\\/[\\%|\\?|\\^$]`);
            //     const regex = new RegExp(`/%\/[^\/]+\/% | \$\^\/[^\/]+\/\^\$ | \?\/[^\/]+\/\?/g`);
            //
            //     // highlightedText = highlightedText.replace(regex, `{{${index+1}}}`);
            //     highlightedText = highlightedText.replace(item, `{{${index+1}}}`);
            //
            //     return {
            //         text: selectedText,
            //         wrapped: item,
            //         index: index + 1,
            //         statusWord:  item.slice(0,3) === "$^/" ? "wrong" : "correct",
            //         type
            //     }
            // })
            //
            //
            // console.log(editorState.toJSON(), "edit")
            //
            // const data = {
            //     text: highlightedText,
            //     editorState: editorState.toJSON(),
            //     words: words
            // }

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