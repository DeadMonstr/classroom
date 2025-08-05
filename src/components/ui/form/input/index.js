import React, { useState } from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";


// const Input = (
// 	{
// 	    type,
// 	    defaultValue,
// 		value,
//         register,
// 	    title = "",
// 	    required,
// 	    pattern,
// 	    name,
// 	    subTitle = "",
// 	    errors,
// 	    placeholder,
// 	    onChange,
// 	    style,
// 	    extraClassName,
// 	    extraClassNameLabel,
// 		disabled,
// 		extraValues,
// 		...rest
// 	}) => {
//
// 	const [showPassword,setShowPassword] = useState(false)
//
// 	return register ? (
// 		<label style={style} className={classNames(styles.inputLabel,extraClassNameLabel)} htmlFor={name}>
// 			{
// 				title || subTitle ?
// 					<div className={styles.info}>
// 						<span>{title}</span>
// 						<span>{subTitle}</span>
// 					</div> : null
// 			}
// 			<div className={styles.field}>
// 				<input
// 					required={required}
// 					disabled={disabled}
// 					id={name}
// 					className={classNames(styles.input,extraClassName,{
// 						[`${styles?.error}`] : errors?.[name]
// 					})}
// 					type={showPassword ? "text" : type}
//
// 					{...register(name,{
// 						pattern: pattern,
// 						defaultValue: defaultValue,
// 						placeholder: placeholder,
// 						value:value,
// 						...extraValues,
//
// 						// onChange: e => onChange(e.target.value)
// 					})}
// 				/>
// 				{
// 					type === "password" ?
// 						<div className={styles.eye} onClick={() => setShowPassword(!showPassword)}>
// 							{
// 								showPassword ?
// 									<i className="fa-solid fa-eye" />
// 									:
// 									<i className="fa-solid fa-eye-slash" />
// 							}
// 						</div> : null
// 				}
// 			</div>
//
// 			<div className={styles.message}>
// 				{
// 					errors?.[name] &&
// 					<span className={styles.message__error}>
// 				        {errors?.[name].message}
// 				    </span>
// 				}
// 			</div>
// 		</label>
// 	) : (
// 		<label style={style} className={classNames(styles.inputLabel,extraClassNameLabel)} htmlFor={name}>
//
// 			{
// 				title || subTitle ?
// 					<div className={styles.info}>
// 						<span>{title}</span>
// 						<span>{subTitle}</span>
// 					</div> : null
// 			}
// 			<div className={styles.field}>
// 				<input
// 					disabled={disabled}
// 					id={name}
// 					className={classNames(styles.input,extraClassName,{
// 						[`${styles?.error}`] : errors?.[name]
// 					})}
// 					defaultValue={defaultValue}
// 					value={value}
// 					type={showPassword ? "text" : type}
// 					pattern={pattern}
// 					required={required}
// 					placeholder={placeholder}
// 					onChange={e => onChange(e.target.value)}
// 					{...rest}
// 					{...extraValues}
// 				/>
// 				{
// 					type === "password" ?
// 						<div className={styles.eye} onClick={() => setShowPassword(!showPassword)}>
// 							{
// 								showPassword ?
// 									<i className="fa-solid fa-eye" />
// 									:
// 									<i className="fa-solid fa-eye-slash" />
// 							}
// 						</div> : null
// 				}
// 			</div>
// 		</label>
// 	);
// }

const Input = ({
				   type = "text",
				   defaultValue,
				   value,
				   register,
				   title = "",
				   required,
				   pattern,
				   name,
				   subTitle = "",
				   errors,
				   placeholder,
				   onChange,
				   style,
				   extraClassName,
				   extraClassNameLabel,
				   disabled,
				   extraValues,
				   min,
				   max,
				   step = 1,
				   ...rest
			   }) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		onChange?.(e.target.value); // Allow free typing
	};

	const handleBlur = (e) => {
		if (type === "number") {
			let numericValue = Number(e.target.value);

			if (!isNaN(numericValue)) {
				if (min !== undefined && numericValue < min) numericValue = min;
				if (max !== undefined && numericValue > max) numericValue = max;
			} else {
				numericValue = min ?? 0; // fallback if empty or invalid
			}

			onChange?.(numericValue);
		}
	};

	const handleKeyDown = (e) => {
		if (type === "number") {
			const numericValue = Number(value);

			if (e.key === "ArrowUp" && max !== undefined && numericValue >= max) {
				e.preventDefault();
			}
			if (e.key === "ArrowDown" && min !== undefined && numericValue <= min) {
				e.preventDefault();
			}
		}
	};

	const inputProps = {
		id: name,
		className: classNames(styles.input, extraClassName, {
			[`${styles.error}`]: errors?.[name],
		}),
		type: showPassword ? "text" : type,
		placeholder,
		required,
		disabled,
		min,
		max,
		step,
		pattern,
		defaultValue,
		value,
		onKeyDown: handleKeyDown,
		...extraValues,
		...rest,
	};

	return (
		<label style={style} className={classNames(styles.inputLabel, extraClassNameLabel)} htmlFor={name}>
			{(title || subTitle) && (
				<div className={styles.info}>
					<span>{title}</span>
					<span>{subTitle}</span>
				</div>
			)}

			<div className={styles.field}>
				{register ? (
					<input
						{...register(name, {
							pattern,
							min,
							max,
							value,
							...extraValues,
						})}
						{...inputProps}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				) : (
					<input
						{...inputProps}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				)}

				{type === "password" && (
					<div className={styles.eye} onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <i className="fa-solid fa-eye" /> : <i className="fa-solid fa-eye-slash" />}
					</div>
				)}
			</div>

			{errors?.[name] && (
				<div className={styles.message}>
					<span className={styles.message__error}>{errors[name].message}</span>
				</div>
			)}
		</label>
	);
};

export default Input;