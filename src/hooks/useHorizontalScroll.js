import { useEffect, useRef, useCallback } from "react";

export function useHorizontalScroll({
										speed = 1, // scroll sensitivity multiplier
										smooth = true, // smooth scroll or instant
									} = {}) {
	const scrollRef = useRef(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onWheel = (e) => {
			// Only scroll horizontally if vertical scroll is minimal
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				e.preventDefault();
				el.scrollTo({
					left: el.scrollLeft + e.deltaY * speed,
					behavior: smooth ? "smooth" : "auto",
				});
			}
		};

		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [speed, smooth]);

	// Scroll by given offset
	const scrollBy = useCallback((offset) => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				left: scrollRef.current.scrollLeft + offset,
				behavior: smooth ? "smooth" : "auto",
			});
		}
	}, [smooth]);

	// Scroll to exact position
	const scrollTo = useCallback((pos) => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				left: pos,
				behavior: smooth ? "smooth" : "auto",
			});
		}
	}, [smooth]);

	return { scrollRef, scrollBy, scrollTo };
}
