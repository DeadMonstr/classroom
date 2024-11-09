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
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {MarkdownShortcutPlugin} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

import ToolbarPlugin from "components/ui/textEditor/plugins/Toolbar";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHightlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";

import "./textEditor.sass"

import exampleTheme from "./themes/ExampleTheme";
import {$getSelection} from "lexical";
import Button from "components/ui/button";


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
    ]
};


function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

function MyOnChangePlugin() {
    const [editor] = useLexicalComposerContext();

    // useEffect(() => {
    //     return editor.registerUpdateListener(({editorState}) => {
    //         onChange(editorState);
    //     });
    // }, [editor, onChange]);

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null && !selection.isCollapsed()) {




                const nodes = selection.getNodes()
                const selectedText = selection.getTextContent();
                const wrappedText = `?/${selectedText}/?`;

                const selectedItem = editor.getElementByKey(nodes[0].getKey())


                // selectedItem.setAttribute("data-type","input")
                // selectedItem.classList.add("Excinput")


                // selection.insertText(wrappedText);
            }
        });
    }



    return <button onClick={onClick}>Hello</button>;
}


function MyOnSubmitPlugin({onSubmit}) {
    const [editor] = useLexicalComposerContext();


    const onSubmitChanges = useCallback(() => {
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);

            const editorState = editor.getEditorState();
            // const inputsRegex = /[\%|\?]\/(.*?)\/[\%|\?]/g;
            const inputsRegex = /%\/[^\/]+\/%|\$\^\/[^\/]+\/\^\$|\?\/[^\/]+\/\?/g;

            let isAll = false
            let index = 0

            // const inputsRegex = /\?\/(.*?)\/\?/g;
            // const matchWordsRegex = /\%\/(.*?)\/\%/g;
            //
            // console.log(dataText?.text?.match(regex))

            const matchWordsRegexList = htmlString?.match(inputsRegex)
            let highlightedText = htmlString

            const words = matchWordsRegexList?.map((item,index) => {

                const type = item.slice(0,2) === "?/" ? "input" : "matchWord"
                // const selectedText = item.slice(2,-2)
                const selectedText = item.match(/\b\w+\b/g);


                console.log(selectedText, "hihihihi")
                console.log(highlightedText)

                console.log(item)
                // const regex = new RegExp(`[\\%|\\?|\\$^]\\/(${selectedText})\\/[\\%|\\?|\\^$]`);
                const regex = new RegExp(`/%\/[^\/]+\/% | \$\^\/[^\/]+\/\^\$ | \?\/[^\/]+\/\?/g`);

                // highlightedText = highlightedText.replace(regex, `{{${index+1}}}`);
                highlightedText = highlightedText.replace(item, `{{${index+1}}}`);

                return {
                    text: selectedText,
                    wrapped: item,
                    index: index + 1,
                    statusWord:  item.slice(0,3) === "$^/" ? "wrong" : "correct",
                    type
                }
            })

            const data = {
                text: highlightedText,
                editorState: editorState.toJSON(),
                words: words
            }


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



const TextEditor = ({onSubmit,options,editorState,text}) => {


    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={"editor"}>
                <div className="editor-container">
                    <ToolbarPlugin options={options}/>
                    <div className="editor-inner">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input"/>}
                            placeholder={<Placeholder/>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin/>
                        <AutoFocusPlugin/>
                        <CodeHighlightPlugin/>
                        <ListPlugin/>
                        <LinkPlugin/>
                        <AutoLinkPlugin/>
                        <ListMaxIndentLevelPlugin maxDepth={7}/>
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS}/>
                        <OnSetEditorState text={text} oldEditorState={editorState}/>
                    </div>
                    <MyOnSubmitPlugin onSubmit={onSubmit}/>
                </div>
            </div>
        </LexicalComposer>
    );
};
export default TextEditor;