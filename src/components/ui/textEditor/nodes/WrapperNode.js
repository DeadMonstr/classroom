import {$isTextNode, ElementNode} from "lexical";
import {$createMathNode, $isMathNode} from "./MathNode";

export class WrapperNode extends ElementNode {
    __wrapperType;

    static getType() {
        return "wrapper";
    }

    static clone(node) {
        return new WrapperNode(node.__wrapperType, node.__key);
    }


    constructor(wrapperType = "input", key) {
        super(key);
        this.__wrapperType = wrapperType;
    }

    createDOM() {
        const dom = document.createElement("span");
        dom.className = `wrapper-node wrapper-${this.__wrapperType}`;
        return dom;
    }

    exportDOM() {
        const span = document.createElement('span');
        span.className = 'wrapper-node';
        span.setAttribute('data-wrapper-type', this.__wrapperType);

        return { element: span };
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return true;
    }

    canBeEmpty() {
        return true; // Allow even if empty
    }

    isIsolated() {
        return false; // Allow typing and caret inside
    }

    canInsertText() {
        return true; // ✅ Allow inline text
    }

    canInsertChild(child) {
        // ✅ Allow both MathNode and TextNode
        return $isMathNode(child) || $isTextNode(child);
    }


    exportJSON() {
        return {
            ...super.exportJSON(),
            type: "wrapper",
            wrapperType: this.__wrapperType,
            version: 1,
        };
    }

    static importJSON(serializedNode) {
        return new WrapperNode(serializedNode.wrapperType);
    }
}

export function $createWrapperNode(wrapperType) {
    return new WrapperNode(wrapperType);
}

export function $isWrapperNode(node) {
    return node instanceof WrapperNode;
}
