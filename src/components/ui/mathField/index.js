import React, { useEffect, useRef, useState } from "react";
import "mathlive";
//
//
import "./mathlive.css"

// import "https://esm.run/mathlive";

const MathInput = ({latex,setLatex}) => {
    const mathFieldRef = useRef(null);

    useEffect(() => {
        const mf = mathFieldRef.current;
        if (mf) {
            // Set initial value once
            mf.value = latex;

            // Input event listener (MathLive's native event)
            const handleInput = (evt) => {
                setLatex(mf.value);
            };

            mf.addEventListener("input", handleInput);

            // Cleanup on unmount
            return () => {
                mf.removeEventListener("input", handleInput);
            };
        }
    }, []);

    return (
        <math-field
            ref={mathFieldRef}
            virtual-keyboard-mode="manual"
            style={{ fontSize: "18px", display: "block", minHeight: "2.5rem" }}
        />
    );
};

export default MathInput;
