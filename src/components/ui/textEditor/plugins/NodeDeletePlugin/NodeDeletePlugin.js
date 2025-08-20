import {
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    COMMAND_PRIORITY_LOW,
    $getSelection,
    $isNodeSelection
} from "lexical";
import { $isMathNode } from "../../nodes/MathNode";
import { $isWrapperNode } from "../../nodes/WrapperNode";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect} from "react";
import {mergeRegister} from "@lexical/utils";

export function NodeDeletePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const removeSelectedNode = () => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach(node => {
                    if ($isMathNode(node) || $isWrapperNode(node)) {
                        node.remove();
                    }
                });
                return true; // stop default
            }
            return false;
        };

        return mergeRegister(
            editor.registerCommand(KEY_DELETE_COMMAND, removeSelectedNode, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_BACKSPACE_COMMAND, removeSelectedNode, COMMAND_PRIORITY_LOW)
        );
    }, [editor]);

    return null;
}
