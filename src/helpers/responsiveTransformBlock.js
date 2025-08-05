// helpers/responsiveTransformBlock.jsx
import { useEffect, useRef } from "react";

const BASE_SIZE = { width: 1280, height: 720 };

export default function ResponsiveTransformBlock({ children }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const scaleContent = () => {
            if (!containerRef.current || !contentRef.current) return;

            const { clientWidth, clientHeight } = containerRef.current;
            const scale = Math.min(
                clientWidth / BASE_SIZE.width,
                clientHeight / BASE_SIZE.height
            );

            const offsetX = (clientWidth - BASE_SIZE.width * scale) / 2;
            const offsetY = (clientHeight - BASE_SIZE.height * scale) / 2;

            contentRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
            contentRef.current.style.transformOrigin = "top left";
        };

        const observer = new ResizeObserver(scaleContent);
        if (containerRef.current) observer.observe(containerRef.current);

        scaleContent();

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%"}}>
            <div
                ref={contentRef}
                style={{
                    position: "absolute",
                    width: `${BASE_SIZE.width}px`,
                    height: `${BASE_SIZE.height}px`,
                    transition: "transform 0.2s ease-out",
                }}
            >
                {children}
            </div>
        </div>
    );
}
