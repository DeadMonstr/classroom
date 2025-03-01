import React from 'react';
import classNames from "classnames";
import styles from "./style.module.sass"


const Button = React.memo(({children,active,type = "simple",disabled,onClick,circle,icon,form,style,reset,extraClass}) => {
	return (
		<button
			type={form ? "submit" : reset ? "reset" : "button"}
			style={style}
			form={form}
			onClick={disabled ? null : onClick}
			className={classNames(styles.btn,styles[type],extraClass,{
				[styles.active]: active,
				[`${styles.disabled}`]: disabled,
				[`${styles.circle}`]: circle,
			})}
			disabled={disabled}
		>
			{children}
		</button>
	);
});

export default Button;