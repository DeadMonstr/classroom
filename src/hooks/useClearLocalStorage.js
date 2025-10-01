import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useLocalStorageCleanupOnRoute(keys = []) {
    const location = useLocation();

    useEffect(() => {
        return () => {
            // когда location.pathname меняется → компонент размонтируется,
            // но только при переходе по роуту внутри SPA
            if (!keys || keys.length === 0) {
                localStorage.clear();
            } else {
                keys.forEach((k) => localStorage.removeItem(k));
            }
        };
    }, [location.pathname, keys]);
}