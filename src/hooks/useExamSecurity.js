// src/hooks/useExamSecurity.js
import { useEffect } from "react";

export const useExamSecurity = () => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("⚠️ You switched tabs!");
                // Optional: log to backend
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                alert("❗ You exited fullscreen (maybe pressed ESC)!");
                // Optional: log or auto-submit exam
            }
        };

        const handleKeyDown = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && e.key === "I") ||
                (e.ctrlKey && e.key.toLowerCase() === "u")
            ) {
                e.preventDefault();
                alert("🔒 Developer tools are disabled during the exam.");
            }

            if (e.key === "Escape") {
                e.preventDefault(); // Prevents default behavior, not fullscreen exit
                alert("🚫 ESC is not allowed during the exam.");
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);
};
