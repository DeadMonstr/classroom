import React, { useEffect, useRef } from "react";
import "mathlive";
import "./mathlive.css"

export default function MathField({ value = "", onChange, readOnly = false, ...attrs }) {
    const ref = useRef(null);

    // init listeners and readOnly property once
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // if you see "HTMLElement" here, mathlive wasn't imported
        // console.log(el.constructor.name);

        const inputHandler = () => onChange?.(el.value ?? "");
        el.addEventListener("input", inputHandler);

        el.readOnly = !!readOnly;

        return () => el.removeEventListener("input", inputHandler);
    }, [onChange, readOnly]);

    // keep element value in sync with React state (no extra options)
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if ((el.value ?? "") !== (value ?? "")) el.value = value ?? "";
    }, [value]);

    return (
        <math-field
            ref={ref}
            virtual-keyboard-mode="onfocus"
            smart-fence
            smart-superscript
            displaystyle
            style={{ minHeight: 48, width: "100%" }}
            {...attrs}
        />
    );
}
