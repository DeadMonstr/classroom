import React, {useEffect, useRef} from 'react';


import styles from "./style.module.sass"
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {disableAlertActive, setAlertOptions} from "slices/layoutSlice";

const Alert = () => {

	// useEffect(() => {
	// 	document.addEventListener("click",handleClickOutside,true)
	// },[])

	const {alert} = useSelector(state => state.layout)

	const ref = useRef()
	const dispatch = useDispatch()


	useEffect(() => {
		if (alert.length > 0) {
			let interval
			for (let i = 0; i < alert.length; i++) {
				interval = setTimeout(() => {
					handleClose(i)
				}, 5000);
			}
			return () => {
				clearTimeout(interval);
			};
		}
	},[alert])



	// const handleClickOutside = (e) => {
	// 	if (!ref.current?.contains(e.target)) {
	// 		dispatch(disableAlertActive())
	// 	}
	// }

	const handleClose = (index) => {
		dispatch(disableAlertActive({index}))
	};





	return (
		<div className={styles.alertWrapper}>
			{
				alert.map((item,index) => {
					if (index < 5) {
						return (
							<div
								ref={ref}
								className={classNames(styles.alert,styles[item?.type],{
									[`${styles.active}`]: item?.active
								})}
							>
							<span className={styles.text}>
								{item?.message}
							</span>
								<span className={styles.close} onClick={(e) => handleClose(index)}>
								<i className="fa-solid fa-xmark" />
							</span>
							</div>
						)
					}
				})
			}
		</div>
	)
};

export default Alert;