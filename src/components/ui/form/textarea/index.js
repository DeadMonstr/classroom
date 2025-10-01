import React from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";


const Textarea = ((
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



    return (
        <label style={style} className={classNames(styles.textareaLabel, extraClassNameLabel)} htmlFor={name}>
            {
                title || subTitle ?
                    <div className={styles.info}>
                        <span>{title}</span>
                        <span>{subTitle}</span>
                    </div> : null
            }
            {register ? (
                <textarea
                    id={name}
                    className={classNames(styles.textarea, extraClassName, {
                        [`${styles?.error}`]: errors?.[name]
                    })}

                    {...register(name)}
                />
            ) : (
                <textarea
                    id={name}
                    className={classNames(styles.textarea, extraClassName, {
                        [`${styles?.error}`]: errors?.[name]
                    })}
                    value={value}
                    required={required}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                />
            )}


            <div className={styles.message}>
                {
                    errors?.[name] &&
                    <span className={styles.message__error}>
				        {errors?.[name].message}
				    </span>
                }
            </div>
        </label>

    );
});

export default Textarea;