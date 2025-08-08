// // nodes/MathNode.js
import {DecoratorNode, $applyNodeReplacement} from "lexical";
import React, {useEffect, useRef} from "react";
//
// export class MathNode extends DecoratorNode {
//     static getType() {
//         return "math";
//     }
//
//     static clone(node) {
//         return new MathNode(node.__latex, node.__key);
//     }
//
//     constructor(latex, key) {
//         super(key);
//         this.__latex = latex;
//     }
//
//     exportJSON() {
//         return {
//             type: "math",
//             latex: this.__latex,
//             version: 1,
//         };
//     }
//
//     static importJSON(serializedNode) {
//         return $createMathNode(serializedNode.latex);
//     }
//
//     createDOM() {
//         const span = document.createElement("span");
//         span.className = "math-node";
//         return span;
//     }
//
//     updateDOM() {
//         return false;
//     }
//
//     decorate() {
//         return (
//             <span className="math-render">
//         {/* You can use MathLive or KaTeX */}
//                 {this.__latex}
//       </span>
//         );
//     }
// }
//
// export function $createMathNode(latex) {
//     return $applyNodeReplacement(new MathNode(latex));
// }
//
// export function $isMathNode(node) {
//     return node instanceof MathNode;
// }

import {useLexicalNodeSelection} from "@lexical/react/useLexicalNodeSelection";

export class MathNode extends DecoratorNode {
    static getType() {
        return "math";
    }

    static clone(node) {
        return new MathNode(node.__latex, node.__styles, node.__key);
    }

    constructor(latex, styles = {}, key) {
        super(key);
        this.__latex = latex;
        this.__styles = styles; // ✅ store all styles as an object
    }

    createDOM() {
        const span = document.createElement("span");
        span.className = "math-node";
        return span;
    }

    updateDOM() {
        return false;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: "math",
            latex: this.__latex,
            styles: this .__styles,
            version: 1,
        };
    }

    exportDOM() {
        const span = document.createElement("span");
        span.className = "math-node";
        span.textContent = this.__latex;
        span.style.backgroundColor = this.__color;
        span.style.padding = "2px 4px";
        span.style.borderRadius = "4px";
        return { element: span };
    }

    setStyle(newStyles) {
        const writable = this.getWritable();
        writable.__styles = {...writable.__styles, ...newStyles}; // ✅ merge new styles
    }

    decorate() {
        return <MathComponent latex={this.__latex} styles={this.__styles} nodeKey={this.getKey()}/>;
    }

    static importJSON(serializedNode) {
        return $createMathNode(serializedNode.latex, serializedNode.color);
    }


    isInline() {
        return true;
    }

    isIsolated() {
        return true;
    }
}

function MathComponent({latex, styles, nodeKey}) {
    const [isSelected] = useLexicalNodeSelection(nodeKey);

    const mathFieldRef = useRef(null);



    useEffect(() => {
        if (mathFieldRef.current) {
            mathFieldRef.current.value = latex;
        }
    }, [latex]);

    return (
        <span
            key={nodeKey}
            style={{
                display: "inline-flex",
                width: "fit-content",
                height: "fit-content",
                ...styles,
                border: isSelected ? "2px solid blue" : styles.border || "none", // ✅ selection highlight
            }}
        >
            <math-field
                ref={mathFieldRef}
                readOnly
                style={{
                    width: "fit-content",
                    height: "fit-content",
                    ...styles,
                }}
            />
    </span>
    );
}

export function $createMathNode(latex, styles) {
    return $applyNodeReplacement(new MathNode(latex, styles));
}

export function $isMathNode(node) {
    return node instanceof MathNode;
}

