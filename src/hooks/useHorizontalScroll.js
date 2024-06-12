import  {useEffect, useRef} from 'react';

const UseHorizontalScroll = (items,limit) => {

	const elRef = useRef();
	useEffect(() => {
		const el = elRef.current;

		if (el && items.length >= limit) {
			const onWheel = e => {
				if (e.deltaY === 0) return;
				e.preventDefault();
				el.scrollTo({
					left: el.scrollLeft + e.deltaY
				});
			};
			el.addEventListener("wheel", onWheel);
			return () => el.removeEventListener("wheel", onWheel);
		}
	}, [items,limit]);
	return elRef;
};

export default UseHorizontalScroll;