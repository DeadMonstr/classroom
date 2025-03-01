import React from 'react';
import classNames from "classnames";

import styles from "./style.module.sass"
import {useForm} from "react-hook-form";

const Form =
	({
		id,
	    onSubmit,
	    children,
	    extraClassname,
		typeSubmit = "inside"
	}) => {



	return (
		<form
			id={id}
			className={classNames(styles.form,extraClassname)}
			onSubmit={onSubmit}
			action=""
		>

			{children}

			{
				typeSubmit === "inside" ? <input value={"Tasdiqlash"} className={styles.submit} type="submit"/> : null
			}

		</form>
	);
};

export default Form;