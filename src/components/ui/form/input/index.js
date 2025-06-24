import React, { useState } from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";


const Input = (
	{
	    type,
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
		extraValues
	}) => {

	const [showPassword,setShowPassword] = useState(false)

	return register ? (
		<label style={style} className={classNames(styles.inputLabel,extraClassNameLabel)} htmlFor={name}>
			{
				title || subTitle ?
					<div className={styles.info}>
						<span>{title}</span>
						<span>{subTitle}</span>
					</div> : null
			}
			<div className={styles.field}>
				<input
					required={required}
					disabled={disabled}
					id={name}
					className={classNames(styles.input,extraClassName,{
						[`${styles?.error}`] : errors?.[name]
					})}
					type={showPassword ? "text" : type}

					{...register(name,{
						pattern: pattern,
						defaultValue: defaultValue,
						placeholder: placeholder,
						value:value,
						...extraValues
						// onChange: e => onChange(e.target.value)
					})}
				/>
				{
					type === "password" ?
						<div className={styles.eye} onClick={() => setShowPassword(!showPassword)}>
							{
								showPassword ?
									<i className="fa-solid fa-eye" />
									:
									<i className="fa-solid fa-eye-slash" />
							}
						</div> : null
				}
			</div>

			<div className={styles.message}>
				{
					errors?.[name] &&
					<span className={styles.message__error}>
				        {errors?.[name].message}
				    </span>
				}
			</div>
		</label>
	) : (
		<label style={style} className={classNames(styles.inputLabel,extraClassNameLabel)} htmlFor={name}>
			<div className={styles.info}>
				<span>{title}</span>
				<span>{subTitle}</span>
			</div>
			<div className={styles.field}>
				<input
					disabled={disabled}
					id={name}
					className={classNames(styles.input,extraClassName,{
						[`${styles?.error}`] : errors?.[name]
					})}
					defaultValue={defaultValue}
					value={value}
					type={showPassword ? "text" : type}
					pattern={pattern}
					required={required}
					placeholder={placeholder}
					onChange={e => onChange(e.target.value)}
					{...extraValues}
				/>
				{
					type === "password" ?
						<div className={styles.eye} onClick={() => setShowPassword(!showPassword)}>
							{
								showPassword ?
									<i className="fa-solid fa-eye" />
									:
									<i className="fa-solid fa-eye-slash" />
							}
						</div> : null
				}
			</div>
		</label>
	);
}

export default Input;