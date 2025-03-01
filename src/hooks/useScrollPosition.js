import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "helpers/contexts";

const useScrollPosition = (context) => {

	const [scrollPos, setScrollPosition] = useState(0);
	const [ended, setEnded] = useState(false);

	useEffect(() => {
		const updatePosition = () => {
			setScrollPosition(context.current.scrollTop);
			setEnded(context.current.scrollHeight - Math.round(context.current.scrollTop) === context.current.clientHeight)
		}

		if (context.current) {
			context.current.addEventListener("scroll", updatePosition);
			updatePosition();
			// eslint-disable-next-line react-hooks/exhaustive-deps
			return () => context.current.removeEventListener("scroll", updatePosition);
		}
	}, [context]);

	return {scrollPos,ended};
};

export default useScrollPosition;