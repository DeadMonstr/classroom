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
import MathField from "components/ui/mathField";

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
            styles: this.__styles,
            version: 1,
        };
    }

    exportDOM() {
        const el = document.createElement("math-field");
        el.setAttribute("readonly", "");
        el.setAttribute("data-latex", this.__latex);
        el.style.display = "inline-block";
        el.style.color = "black";
        el.style.backgroundColor = "white";
        // MathLive reads textContent as LaTeX
        el.textContent = this.__latex;
        return { element: el };
    }

    // Allow pasting/rehydration from HTML that has <math-field> or legacy .math-node
    static importDOM() {
        return {
            "math-field": () => ({
                conversion: (node) => {
                    const latex = (node.getAttribute("data-latex") ?? node.textContent ?? "").trim();
                    return { node: new MathNode(latex) };
                },
                priority: 3,
            }),
            "span": (domNode) => {
                if (domNode.classList?.contains("math-node")) {
                    return {
                        conversion: (node) => {
                            const latex = (node.getAttribute("data-latex") ?? node.textContent ?? "").trim();
                            return { node: new MathNode(latex) };
                        },
                        priority: 2,
                    };
                }
                return null;
            },
        };
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


    return (
        <span
            key={nodeKey}
            style={{
                display: "inline-flex",
                width: "fit-content",
                height: "fit-content",
                padding: "5px",
                ...styles,
                border: isSelected ? "2px solid blue" : "1px dotted black", // ✅ selection highlight
            }}
        >
         <MathField
             style={{
                 userSelect: "none",
                 backgroundColor: "white",
                 color: "black",
                 border: "none",
                 fontSize: "2rem",

             }}
             value={latex} readOnly
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

