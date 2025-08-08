import React, {useEffect, useState} from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";



const Radio = ({ name, id, value, onChange, checked, children, extraClassname,disabled }) => {

	const [active,setActive] = useState(false)


	useEffect(() => {
		setActive(checked)
	},[checked])



	return (
		<label htmlFor={id} className={classNames(styles.radioLabel,extraClassname)}>
			<input
				disabled={disabled}
				className={styles.radioInput}
				type="radio"
				name={name}
				id={id}
				value={value}
				onChange={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onChange(value)
					setActive(e.target.checked)
				}}
				checked={checked}
			/>
			<div className={styles.wrapper}>
				<span className={classNames(styles.customRadio, {
					[styles.active] : active
				})} />
			</div>
			<span
				onMouseDownCapture={(e) => {
					const radio = e.currentTarget.closest('label')?.querySelector('input[type="radio"]');
					if (radio && !radio.checked) {
						radio.click();
					}
				}}
				className={styles.text}
			>
				{children}
			</span>
		</label>
	);
};

export default Radio;