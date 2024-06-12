import React from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";



const Radio = ({ name, id, value, onChange, checked, children, extraClassname,disabled }) => {
	return (
		<label htmlFor={id} className={classNames(styles.radioLabel,extraClassname)}>
			<input
				disabled={disabled}
				className={styles.radioInput}
				type="radio"
				name={name}
				id={id}
				value={value}
				onChange={() => onChange(value)}
				checked={checked}
			/>
			<span className={styles.customRadio} />
			<span className={styles.text}>
				{children}
			</span>
		</label>
	);
};

export default Radio;