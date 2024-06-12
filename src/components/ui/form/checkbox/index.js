import React from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";

const Checkbox = ({ name, id, value, onChange, checked,cls = [],disabled }) => {
	return (
		<label htmlFor={id} className={classNames(styles.label,[...cls])}>
			<input
				className={styles.checkbox}
				type="checkbox"
				name={name}
				id={id}
				value={value}
				onChange={e => onChange(e.target.checked)}
				checked={checked}
				disabled={disabled}
			/>
		</label>
	);
};

export default Checkbox;