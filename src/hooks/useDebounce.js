import { useEffect, useState } from "react";

function useDebounce(callback, delay, dependencies = []) {
    useEffect(() => {
        const handler = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [...dependencies, delay]);
}

export default useDebounce;
