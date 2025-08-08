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
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import TableCellResizer from './plugins/TableCellResizer';
// import TableCellActionMenuPlugin from 'components/ui/textEditor/plugins/TableActionMenuPlugin';
import ToolbarPlugin from "components/ui/textEditor/plugins/Toolbar";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHightlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import {
    $createNodeSelection, $getNearestNodeFromDOMNode,
    $getNodeByKey, $getRoot,
    $getSelection, $isElementNode, $isTextNode, $setSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW
} from "lexical";

import "./textEditor.sass"

import exampleTheme from "./themes/ExampleTheme";
import Button from "components/ui/button";
import TableHoverActionsPlugin from "components/ui/textEditor/plugins/TableHoverActionsPlugin";
import {$isMathNode, MathNode} from "./nodes/MathNode";
import {$isWrapperNode, WrapperNode} from "./nodes/WrapperNode";


const editorConfig = {
    // The editor theme
    theme: exampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        MathNode,
        WrapperNode
    ]
};


export function MathClickPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            CLICK_COMMAND,
            (event) => {
                const target = event.target.closest(".math-node");
                if (target) {
                    editor.update(() => {
                        const node = $getNearestNodeFromDOMNode(target); // ✅ get node directly
                        if (node && $isMathNode(node)) {
                            const selection = $createNodeSelection();
                            selection.add(node.getKey());
                            $setSelection(selection);
                        }
                    });
                    return true;
                }
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);


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
    const highlightedParagraphs = [];

    editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        children.forEach((blockNode) => {
            if ($isElementNode(blockNode)) {
                const paragraphContent = [];

                const recursiveExtract = (node, type = "") => {
                    if ($isWrapperNode(node)) {
                        const wrapperType = node.__wrapperType;
                        const nonMathChild = node.getChildren()
                        nonMathChild.forEach((child) => recursiveExtract(child, wrapperType));
                    } else if ($isMathNode(node)) {
                        const latex = node.__latex;

                        if (type === "matchWord" || type === "wrong") {
                            const placeholder = `{{${++index}}}`;
                            const symbol =
                                type === "matchWord"
                                    ? "%/"
                                    : type === "wrong"
                                        ? "$^/"
                                        : "?/";
                            const closing = type === "wrong" ? "/^$" : "/?";

                            words.push({
                                text: latex,
                                wrapped: `${symbol}${latex}${closing}`,
                                isMath: true,
                                index,
                                type: type,
                                statusWord: type === "wrong" ? "wrong" : "correct",
                            });

                            paragraphContent.push(placeholder);
                        } else {
                            const mathHTML = `<span style="display: inline-flex;" class="math-node">
                                  <math-field style="width: fit-content; height: fit-content; display: inline-flex;" readonly>
                                    ${latex}
                                  </math-field>
                                </span>`;
                            paragraphContent.push(mathHTML);
                        }

                    } else if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        const regex = /%\/[^/]+\/%|\$\^\/[^/]+\/\^\$|\?\/[^/]+\/\?/g;
                        let lastIndex = 0;
                        let match;

                        while ((match = regex.exec(text)) !== null) {
                            const matched = match[0];
                            const start = match.index;

                            // Push text before match
                            if (start > lastIndex) {
                                paragraphContent.push(text.slice(lastIndex, start));
                            }

                            const placeholder = `{{${++index}}}`;
                            const type = matched.startsWith("%/")
                                ? "matchWord"
                                : "input";

                            words.push({
                                text: matched.match(/[^/]+/g)[1],
                                wrapped: matched,
                                index,
                                type,
                                statusWord: type === "wrong" ? "wrong" : "correct",
                            });

                            paragraphContent.push(placeholder);
                            lastIndex = regex.lastIndex;
                        }

                        // Push remaining text
                        if (lastIndex < text.length) {
                            paragraphContent.push(text.slice(lastIndex));
                        }
                    } else if ($isElementNode(node)) {
                        node.getChildren().forEach(recursiveExtract);
                    }
                }

                recursiveExtract(blockNode)

                const paragraphText = paragraphContent.join("");
                highlightedParagraphs.push(
                    `<p class="editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">${paragraphText}</span></p>`
                );
            }
        });
    });


    return {
        text: highlightedParagraphs.join(""),

        words,
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

    const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
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
            <div className={"editor"}>
                <div className="editor-container">
                    <ToolbarPlugin options={options}/>
                    <div className="editor-inner">
                        <RichTextPlugin
                            contentEditable={<div ref={onRef}>
                                <ContentEditable className="editor-input"/>
                            </div>}
                            placeholder={<Placeholder/>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <TablePlugin
                            hasCellMerge={true}
                            hasCellBackgroundColor={true}
                            hasHorizontalScroll={true}
                        />
                        <TableCellResizer/>
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
                                <TableHoverActionsPlugin anchorElem={floatingAnchorElem}/>

                            </>
                        )}

                    </div>
                    <MyOnSubmitPlugin onSubmit={onSubmit}/>
                </div>
            </div>
        </LexicalComposer>
    );
};
export default TextEditor;