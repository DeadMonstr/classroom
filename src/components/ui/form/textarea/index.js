import React from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";


const Textarea = React.memo((
	{
		defaultValue,
		register,
		title = "",
		required,
		name,
		subTitle = "",
		errors,
		placeholder,
		onChange,
		style,
		extraClassName,
		extraClassNameLabel,
		value
	}) => {


	return register ? (
		<label style={style}  className={classNames(styles.textareaLabel,extraClassNameLabel)} htmlFor={name}>
			{
				title || subTitle ?
					<div className={styles.info}>
						<span>{title}</span>
						<span>{subTitle}</span>
					</div> : null
			}

			<textarea
				id={name}
				className={classNames(styles.textarea,extraClassName,{
					[`${styles?.error}`] : errors?.[name]
				})}
				required={required}
				{...register(name,{
					value:value,
					defaultValue: defaultValue,
					placeholder: placeholder,
					onChange: e => onChange ? onChange(e): null
				})}
			/>
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
		<label style={style} className={classNames(styles.textareaLabel,extraClassNameLabel)} htmlFor={name}>
			<div className={styles.info}>
				<span>{title} </span>
				<span>{subTitle}</span>
			</div>
			<textarea
				id={name}
				className={classNames(styles.textarea,extraClassName,{
					[`${styles?.error}`] : errors?.[name]
				})}
				value={value}
				required={required}
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChange={e => onChange(e.target.value)}
			/>
		</label>
	);
});

export default Textarea;