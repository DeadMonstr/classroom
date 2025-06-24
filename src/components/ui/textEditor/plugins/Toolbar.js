import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getNodeByKey, COMMAND_PRIORITY_CRITICAL
} from "lexical";
import {$isLinkNode, TOGGLE_LINK_COMMAND} from "@lexical/link";
import { $wrapNodes, $isAtNodeEnd, $patchStyleText, $getSelectionStyleValueForProperty} from "@lexical/selection";
import {$findMatchingParent, $getNearestNodeOfType, mergeRegister} from "@lexical/utils";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode, ListNode} from "@lexical/list";
import {createPortal} from "react-dom";
import {$createHeadingNode, $createQuoteNode, $isHeadingNode} from "@lexical/rich-text";
import {$createCodeNode, $isCodeNode, getDefaultCodeLanguage, getCodeLanguages} from "@lexical/code";

import ColorPicker from "../ui/ColorPicker/ColorPicker";
import DropDown, {DropDownItem} from "../ui/DropDown/DropDown";
import FontSize from "../ui/FontSize/FontSize";
import {INSERT_HORIZONTAL_RULE_COMMAND} from "@lexical/react/LexicalHorizontalRuleNode";
import useModal from "hooks/useModal";
import {InsertTableDialog} from "components/ui/textEditor/plugins/TablePlugin";
import {$isTableNode} from "@lexical/table";


const LowPriority = 1;

const supportedBlockTypes = new Set(["paragraph", "quote", "code", "h1", "h2", "ul", "ol"]);

const blockTypeToBlockName = {
    code: "Code Block",
    h1: "Large Heading",
    h2: "Small Heading",
    h3: "Heading",
    h4: "Heading",
    h5: "Heading",
    ol: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
    ul: "Bulleted List",
    color: "Color"
};

function Divider() {
    return <div className="divider"/>;
}

function positionEditorElement(editor, rect) {
    if (rect === null) {
        editor.style.opacity = "0";
        editor.style.top = "-1000px";
        editor.style.left = "-1000px";
    } else {
        editor.style.opacity = "1";
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
    }
}

function FloatingLinkEditor({editor}) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const mouseDownRef = useRef(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent)) {
                setLinkUrl(parent.getURL());
            } else if ($isLinkNode(node)) {
                setLinkUrl(node.getURL());
            } else {
                setLinkUrl("");
            }
        }
        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;

        if (editorElem === null) {
            return;
        }

        const rootElement = editor.getRootElement();
        if (selection !== null && !nativeSelection.isCollapsed && rootElement !== null && rootElement.contains(nativeSelection.anchorNode)) {
            const domRange = nativeSelection.getRangeAt(0);
            let rect;
            if (nativeSelection.anchorNode === rootElement) {
                let inner = rootElement;
                while (inner.firstElementChild != null) {
                    inner = inner.firstElementChild;
                }
                rect = inner.getBoundingClientRect();
            } else {
                rect = domRange.getBoundingClientRect();
            }

            if (!mouseDownRef.current) {
                positionEditorElement(editorElem, rect);
            }
            setLastSelection(selection);
        } else if (!activeElement || activeElement.className !== "link-input") {
            positionEditorElement(editorElem, null);
            setLastSelection(null);
            setEditMode(false);
            setLinkUrl("");
        }

        return true;
    }, [editor]);

    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    updateLinkEditor();
                });
            }),

            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                updateLinkEditor();
                return true;
            }, LowPriority));
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    return (<div ref={editorRef} className="link-editor">
        {isEditMode ? (<input
            ref={inputRef}
            className="link-input"
            value={linkUrl}
            onChange={(event) => {
                setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    if (lastSelection !== null) {
                        if (linkUrl !== "") {
                            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                        }
                        setEditMode(false);
                    }
                } else if (event.key === "Escape") {
                    event.preventDefault();
                    setEditMode(false);
                }
            }}
        />) : (<>
            <div className="link-input">
                <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                    {linkUrl}
                </a>
                <div
                    className="link-edit"
                    role="button"
                    tabIndex={0}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                        setEditMode(true);
                    }}
                />
            </div>
        </>)}
    </div>);
}

function Select({onChange, className, options, value}) {
    return (<select className={className} onChange={onChange} value={value}>
        <option hidden={true} value=""/>
        {options.map((option) => (<option key={option} value={option}>
            {option}
        </option>))}
    </select>);
}

function getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}

function dropDownActiveClass(active) {
    if (active) return 'active dropdown-item-active';
    else return '';
}


const BlockOptions = ({editor, blockType}) => {
    const formatParagraph = () => {
        if (blockType !== "paragraph") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const formatLargeHeading = () => {
        if (blockType !== "h1") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h1"));
                }
            });
        }

    };

    const formatSmallHeading = () => {
        if (blockType !== "h2") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h2"));
                }
            });
        }

    };

    const formatBulletList = () => {
        if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }

    };

    const formatNumberedList = () => {
        if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
    };

    const formatQuote = () => {
        if (blockType !== "quote") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode());
                }
            });
        }
    };

    const formatCode = () => {
        if (blockType !== "code") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createCodeNode());
                }
            });
        }
    };


    return (
        <>
            <DropDown
                // disabled={disabled}
                buttonClassName="toolbar-item block-controls"
                buttonIconClassName={'icon block-type ' + blockType}
                buttonLabel={blockTypeToBlockName[blockType]}
                buttonAriaLabel="Formatting options for text style">
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
                    onClick={formatParagraph}>
                    <i className="icon paragraph"/>
                    <span className="text">Normal</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'h1')}
                    onClick={formatLargeHeading}>
                    <i className="icon h1"/>
                    <span className="text">Heading 1</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'h2')}
                    onClick={formatSmallHeading}>
                    <i className="icon h2"/>
                    <span className="text">Heading 2</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'bullet')}
                    onClick={formatBulletList}>
                    <i className="icon bullet-list"/>
                    <span className="text">Bullet List</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'number')}
                    onClick={formatNumberedList}>
                    <i className="icon numbered-list"/>
                    <span className="text">Numbered List</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'quote')}
                    onClick={formatQuote}>
                    <i className="icon quote"/>
                    <span className="text">Quote</span>
                </DropDownItem>
                <DropDownItem
                    className={'item ' + dropDownActiveClass(blockType === 'code')}
                    onClick={formatCode}>
                    <i className="icon code"/>
                    <span className="text">Code Block</span>
                </DropDownItem>
            </DropDown>

        </>

    )
}

function DropdownColorPicker({disabled = false, stopCloseOnClickSelf = true, color, onChange, ...rest}) {
    return (
        <DropDown
            {...rest}
            disabled={disabled}
            stopCloseOnClickSelf={stopCloseOnClickSelf}
        >
            <ColorPicker color={color} onChange={onChange}/>
        </DropDown>
    );
}


const InputToolBarPlugin = () => {
    const [editor] = useLexicalComposerContext()
    const [value,setValue] = useState(0)


    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {

                // const selectedItem = editor.getElementByKey(nodes[0].getKey())
                // selectedItem.setAttribute("data-input","true")



                // $wrapNodes(selection,() => $createInputNode())
                // $setBlocksType(selection,() => $createInputNode())
                // selection.insertNodes([myNode])

                // console.log()
                //
                // const selectedItem = editor.getElementByKey(nodes[0].getKey())


                const nodes = selection.getNodes()
                const selectedText = selection.getTextContent();
                const wrappedText = `?/${selectedText}/?`;

                const selectedItem = editor.getElementByKey(nodes[0].getKey())


                // selectedItem.setAttribute("data-type","input")
                // selectedItem.classList.add("Excinput")


                selection.insertText(wrappedText);
                setValue(old => old +1)

            }
        })


    }

    return (
        <button
            className={"toolbar-item spaced"}
            aria-label="Format Italics"
            onClick={onClick}
        >
            <i className="input format"/>
        </button>
    )

}



const MatchToolBarPlugin = () => {
    const [editor] = useLexicalComposerContext()
    const [value,setValue] = useState(0)
    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {

                // const selectedItem = editor.getElementByKey(nodes[0].getKey())
                // selectedItem.setAttribute("data-input","true")


                // $wrapNodes(selection,() => $createInputNode())
                // $setBlocksType(selection,() => $createInputNode())
                // selection.insertNodes([myNode])

                // console.log()
                //
                // const selectedItem = editor.getElementByKey(nodes[0].getKey())

                const nodes = selection.getNodes()
                const selectedText = selection.getTextContent();
                const wrappedText = `%/${selectedText}/%`;

                const selectedItem = editor.getElementByKey(nodes[0].getKey())

                // selectedItem.setAttribute("data-type","input")
                // selectedItem.classList.add("Excinput")

                selection.insertText(wrappedText);
                setValue(old => old +1)

            }
        })


    }

    return (
        <button
            className={"toolbar-item spaced"}
            aria-label="Format Italics"
            onClick={onClick}
        >
            <i className="match format"/>
        </button>
    )

}

const MatchWrongToolBarPlugin = () => {
    const [editor] = useLexicalComposerContext()
    const [value,setValue] = useState(0)
    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {

                // const selectedItem = editor.getElementByKey(nodes[0].getKey())
                // selectedItem.setAttribute("data-input","true")


                // $wrapNodes(selection,() => $createInputNode())
                // $setBlocksType(selection,() => $createInputNode())
                // selection.insertNodes([myNode])

                // console.log()
                //
                // const selectedItem = editor.getElementByKey(nodes[0].getKey())

                const nodes = selection.getNodes()
                const selectedText = selection.getTextContent();
                const wrappedText = `$^/${selectedText}/^$`;

                const selectedItem = editor.getElementByKey(nodes[0].getKey())

                // selectedItem.setAttribute("data-type","input")
                // selectedItem.classList.add("Excinput")

                selection.insertText(wrappedText);
                setValue(old => old +1)

            }
        })


    }

    return (
        <button
            className={"toolbar-item spaced"}
            aria-label="Format Italics"
            onClick={onClick}
        >
            <i className="match format"/>
        </button>
    )

}
const Context = createContext(undefined);


export const useToolbarState = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useToolbarState must be used within a ToolbarProvider');
    }

    return context;
};

export default function ToolbarPlugin({options}) {
    const [editor] = useLexicalComposerContext();

    const [modal, showModal] = useModal();

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");
    const [fontSize, setFontSize] = useState('15px');
    const [fontColor, setFontColor] = useState('#000');
    const [bgColor, setBgColor] = useState('#fff');
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [codeLanguage, setCodeLanguage] = useState("");
    const [isLink, setIsLink] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const [activeEditor, setActiveEditor] = useState(editor);


    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    setBlockType(type);
                    if ($isCodeNode(element)) {
                        setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                    }
                }
            }



            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsCode(selection.hasFormat("code"));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }

            const tableNode = $findMatchingParent(node, $isTableNode);
            // if ($isTableNode(tableNode)) {
            //     updateToolbarState('rootType', 'table');
            // } else {
            //     updateToolbarState('rootType', 'root');
            // }
            setFontSize(
                $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
            );
            setFontColor(
                $getSelectionStyleValueForProperty(selection, 'color', '#000'),
            );
            setBgColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    'background-color',
                    '#fff',
                ),
            );
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateToolbar();
            });
        }), editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            updateToolbar();
            return false;
        }, LowPriority), editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
            setCanUndo(payload);
            return false;
        }, LowPriority), editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
            setCanRedo(payload);
            return false;
        }, LowPriority));
    }, [editor, updateToolbar]);



    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                updateToolbar();
                setActiveEditor(newEditor);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, updateToolbar]);

    const codeLanguages = useMemo(() => getCodeLanguages(), []);
    const onCodeLanguageSelect = useCallback((e) => {
        editor.update(() => {
            if (selectedElementKey !== null) {
                const node = $getNodeByKey(selectedElementKey);
                if ($isCodeNode(node)) {
                    node.setLanguage(e.target.value);
                }
            }
        });
    }, [editor, selectedElementKey]);

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);


    const applyStyleText = useCallback(
        (styles, skipHistoryStack) => {
            activeEditor.update(
                () => {
                    const selection = $getSelection();
                    if (selection !== null) {
                        $patchStyleText(selection, styles);
                    }
                },
                skipHistoryStack ? {tag: 'historic'} : {},
            );
        },
        [activeEditor],
    );

    const onFontColorSelect = useCallback(
        (value, skipHistoryStack) => {
            applyStyleText({color: value}, skipHistoryStack);
        },
        [applyStyleText],
    );


    const onBgColorSelect = useCallback(
        (value, skipHistoryStack) => {
            applyStyleText({'background-color': value}, skipHistoryStack);
        },
        [applyStyleText],
    );


    return (
        <div className="toolbar">
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND);
                }}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <i className="format undo"/>
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND);
                }}
                className="toolbar-item"
                aria-label="Redo"
            >
                <i className="format redo"/>
            </button>
            <Divider/>
            <BlockOptions editor={editor} blockType={blockType}/>
            <Divider/>
            {blockType === "code" ? (
                <>
                    <Select
                        className="toolbar-item code-language"
                        onChange={onCodeLanguageSelect}
                        options={codeLanguages}
                        value={codeLanguage}
                    />
                    <i className="chevron-down inside"/>
                </>
            ) : (
                <>

                    <FontSize
                        selectionFontSize={fontSize.slice(0,-2)}
                        editor={editor}
                    />
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                        }}
                        className={"toolbar-item spaced " + (isBold ? "active" : "")}
                        aria-label="Format Bold"
                    >
                        <i className="format bold"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                        }}
                        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
                        aria-label="Format Italics"
                    >
                        <i className="format italic"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                        }}
                        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
                        aria-label="Format Underline"
                    >
                        <i className="format underline"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                        }}
                        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
                        aria-label="Format Strikethrough"
                    >
                        <i className="format strikethrough"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                        }}
                        className={"toolbar-item spaced " + (isCode ? "active" : "")}
                        aria-label="Insert Code"
                    >
                        <i className="format code"/>
                    </button>

                    <button
                        onClick={insertLink}
                        className={"toolbar-item spaced " + (isLink ? "active" : "")}
                        aria-label="Insert Link"
                    >
                        <i className="format link"/>
                    </button>
                    {
                        options?.input && <InputToolBarPlugin/>
                    }
                    {
                        options?.match && <MatchToolBarPlugin/>
                    }
                    {
                        options?.matchWrong && <MatchWrongToolBarPlugin/>
                    }
                    <DropdownColorPicker
                        buttonClassName="toolbar-item color-picker"
                        buttonAriaLabel="Formatting text color"
                        buttonIconClassName="icon font-color"
                        color={fontColor}
                        onChange={onFontColorSelect}
                        title="text color"
                    />

                    <DropdownColorPicker
                        buttonClassName="toolbar-item color-picker"
                        buttonAriaLabel="Formatting background color"
                        buttonIconClassName="icon bg-color"
                        color={bgColor}
                        onChange={onBgColorSelect}
                        title="bg color"
                    />


                    <Divider/>
                    <DropDown
                        buttonClassName="toolbar-item spaced"
                        buttonLabel="Insert"
                        buttonAriaLabel="Insert specialized editor node"
                        buttonIconClassName="icon plus">
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        activeEditor.dispatchCommand(*/}
                        {/*            INSERT_HORIZONTAL_RULE_COMMAND,*/}
                        {/*            undefined,*/}
                        {/*        );*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon horizontal-rule" />*/}
                        {/*    <span className="text">Horizontal Rule</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon page-break" />*/}
                        {/*    <span className="text">Page Break</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        showModal('Insert Image', (onClose) => (*/}
                        {/*            <InsertImageDialog*/}
                        {/*                activeEditor={activeEditor}*/}
                        {/*                onClose={onClose}*/}
                        {/*            />*/}
                        {/*        ));*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon image" />*/}
                        {/*    <span className="text">Image</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        showModal('Insert Inline Image', (onClose) => (*/}
                        {/*            <InsertInlineImageDialog*/}
                        {/*                activeEditor={activeEditor}*/}
                        {/*                onClose={onClose}*/}
                        {/*            />*/}
                        {/*        ));*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon image" />*/}
                        {/*    <span className="text">Inline Image</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() =>*/}
                        {/*        insertGifOnClick({*/}
                        {/*            altText: 'Cat typing on a laptop',*/}
                        {/*            src: catTypingGif,*/}
                        {/*        })*/}
                        {/*    }*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon gif" />*/}
                        {/*    <span className="text">GIF</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        activeEditor.dispatchCommand(*/}
                        {/*            INSERT_EXCALIDRAW_COMMAND,*/}
                        {/*            undefined,*/}
                        {/*        );*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon diagram-2" />*/}
                        {/*    <span className="text">Excalidraw</span>*/}
                        {/*</DropDownItem>*/}
                        <DropDownItem
                            onClick={() => {
                                showModal('Insert Table', (onClose) => (
                                    <InsertTableDialog
                                        activeEditor={activeEditor}
                                        onClose={onClose}
                                    />
                                ));
                            }}
                            className="item">
                            <i className="icon table" />
                            <span className="text">Table</span>
                        </DropDownItem>
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        showModal('Insert Poll', (onClose) => (*/}
                        {/*            <InsertPollDialog*/}
                        {/*                activeEditor={activeEditor}*/}
                        {/*                onClose={onClose}*/}
                        {/*            />*/}
                        {/*        ));*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon poll" />*/}
                        {/*    <span className="text">Poll</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        showModal('Insert Columns Layout', (onClose) => (*/}
                        {/*            <InsertLayoutDialog*/}
                        {/*                activeEditor={activeEditor}*/}
                        {/*                onClose={onClose}*/}
                        {/*            />*/}
                        {/*        ));*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon columns" />*/}
                        {/*    <span className="text">Columns Layout</span>*/}
                        {/*</DropDownItem>*/}

                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        showModal('Insert Equation', (onClose) => (*/}
                        {/*            <InsertEquationDialog*/}
                        {/*                activeEditor={activeEditor}*/}
                        {/*                onClose={onClose}*/}
                        {/*            />*/}
                        {/*        ));*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon equation" />*/}
                        {/*    <span className="text">Equation</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        editor.update(() => {*/}
                        {/*            const root = $getRoot();*/}
                        {/*            const stickyNode = $createStickyNode(0, 0);*/}
                        {/*            root.append(stickyNode);*/}
                        {/*        });*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon sticky" />*/}
                        {/*    <span className="text">Sticky Note</span>*/}
                        {/*</DropDownItem>*/}
                        {/*<DropDownItem*/}
                        {/*    onClick={() => {*/}
                        {/*        editor.dispatchCommand(*/}
                        {/*            INSERT_COLLAPSIBLE_COMMAND,*/}
                        {/*            undefined,*/}
                        {/*        );*/}
                        {/*    }}*/}
                        {/*    className="item">*/}
                        {/*    <i className="icon caret-right" />*/}
                        {/*    <span className="text">Collapsible container</span>*/}
                        {/*</DropDownItem>*/}
                        {/*{EmbedConfigs.map((embedConfig) => (*/}
                        {/*    <DropDownItem*/}
                        {/*        key={embedConfig.type}*/}
                        {/*        onClick={() => {*/}
                        {/*            activeEditor.dispatchCommand(*/}
                        {/*                INSERT_EMBED_COMMAND,*/}
                        {/*                embedConfig.type,*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*        className="item">*/}
                        {/*        {embedConfig.icon}*/}
                        {/*        <span className="text">{embedConfig.contentName}</span>*/}
                        {/*    </DropDownItem>*/}
                        {/*))}*/}
                    </DropDown>
                    <Divider/>


                    {isLink && createPortal(<FloatingLinkEditor editor={editor}/>, document.body)}
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                        }}
                        className="toolbar-item spaced"
                        aria-label="Left Align"
                    >
                        <i className="format left-align"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                        }}
                        className="toolbar-item spaced"
                        aria-label="Center Align"
                    >
                        <i className="format center-align"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                        }}
                        className="toolbar-item spaced"
                        aria-label="Right Align"
                    >
                        <i className="format right-align"/>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                        }}
                        className="toolbar-item"
                        aria-label="Justify Align"
                    >
                        <i className="format justify-align"/>
                    </button>

                    {modal}
                </>
            )}
        </div>
    );
}
