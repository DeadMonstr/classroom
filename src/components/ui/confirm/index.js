import React, {useEffect, useRef} from 'react';

import styles from "./styles.module.sass"
import Button from "../button";
import classNames from "classnames";

const Confirm = React.memo(({active,setActive,children,onSubmit}) => {

	useEffect(() => {
		document.addEventListener("click",handleClickOutside,true)
	},[])

	const ref = useRef()

	const handleClickOutside = (e) => {
		if (!ref.current?.contains(e.target)) {
			setActive()
		}
	}

	return (
		<div className={classNames(styles.overlay, {
			[`${styles.active}`]: active
		})} >
			<div
				ref={ref}
				className={styles.confirm}
			>
				<div className={styles.content}>
					{children}
				</div>
				<div className={styles.footer}>
					<Button onClick={onSubmit} type={"submit"}>Ha</Button>
					<Button onClick={setActive} type={"danger"}>Yoq</Button>
				</div>
			</div>
		</div>

	);
});

export default Confirm;