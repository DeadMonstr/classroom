import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';

// import Button from '../ui/Button';
// import {DialogActions} from '../ui/Dialog';
// import TextInput from '../ui/TextInput';
import {$createMathNode} from "components/ui/textEditor/nodes/MathNode";
import {$createParagraphNode, $getRoot, $getSelection, $isRangeSelection} from "lexical";
import MathField from "components/ui/mathField";
import {$isWrapperNode} from "components/ui/textEditor/nodes/WrapperNode";




export function InsertMathModal({
                                      activeEditor,
                                      onClose,
                                  }) {
    const [latex, setLatex] = useState("");

    const handleInsertMath = (latex) => {
        activeEditor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();

            // 🧠 Find if cursor is inside a WrapperNode
            let parent = anchorNode;
            while (parent && !$isWrapperNode(parent)) {
                parent = parent.getParent();
            }

            const mathNode = $createMathNode(latex);

            if ($isWrapperNode(parent)) {
                // ✅ Insert into wrapper
                parent.append(mathNode);
                mathNode.selectNext(); // optional: move cursor after
            } else {
                // ✅ Insert directly at selection
                const topLevel = anchorNode.getTopLevelElementOrThrow();
                if (topLevel.getType() === 'root') {
                    const paragraph = $createParagraphNode();
                    paragraph.append(mathNode);
                    $getRoot().append(paragraph);
                } else {
                    selection.insertNodes([mathNode]);
                }

                mathNode.selectNext();
            }
        });
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Insert Math</h3>
                <MathField latex={latex} setLatex={setLatex} />
                <div className="actions">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={() => {
                            handleInsertMath(latex);
                            setLatex("");
                        }}
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
}

// export function TablePlugin({
//                                 cellEditorConfig,
//                                 children,
//                             }) {
//     const [editor] = useLexicalComposerContext();
//     const cellContext = useContext(CellContext);
//     useEffect(() => {
//         if (!editor.hasNodes([TableNode, TableRowNode, TableCellNode])) {
//             throw new Error(
//                 'Internal Lexical error: invariant() is meant to be replaced at compile ' +
//                 'time. There is no runtime version. Error: '
//             );
//         }
//     }, [editor]);
//     useEffect(() => {
//         cellContext.set(cellEditorConfig, children);
//     }, [cellContext, cellEditorConfig, children]);
//     return null;
// }
