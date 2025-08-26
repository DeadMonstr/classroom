import React, {useCallback, useEffect, useState} from 'react';
import styles from "./styles.module.sass"
import classNames from "classnames";


const Select = React.memo((
    {
        title = "",
        subTitle = "",
        type = "simple",
        options = [],
        name = "",
        register,
        errors,
        value,
        pattern,
        placeholder,
        onChange,
        required,
        defaultOption,
        style,
        extraClassName,
        all,
        optional,
        multiNames = [],
        keyValue,
        disabled
    }) => {

    const [currentOptions, setCurrentOptions] = useState([])




    useEffect(() => {
        if (options.length > 0) {
            let allObj = []


            if (all) {

                if (value) {
                    onChange(value)
                } else {
                    onChange("all")
                }
                allObj = [{
                    name: "Hammasi",
                    value: "all",
                    selected: 0,
                }]
            }

            if (optional) {

                if (value) {
                    onChange(value)
                } else {
                    onChange("no")
                }
                allObj = [{
                    name: "Not selected",
                    value: "no",
                    selected: 0,
                }]
            }


            if (typeof options[0] !== "object") {
                setCurrentOptions(() => [...allObj ,...options.map((item, index) => {
                    if (index === 0 && !value && !all) {
                        onChange(item)
                    }
                    return {
                        name: item,
                        value: item,
                        selected: index === 0 && !all && !optional,
                    }
                })])
            } else {
                setCurrentOptions(() => [...allObj,...options.map((item, index) => {
                    if (index === 0 && !value && !all && !optional) {
                        onChange(item[keyValue] || item.value || item.id || item.name || item)
                    }
                    return {
                        ...item,
                        name: item.name || item.value || item,
                        value: item[keyValue] || item.value || item.id || item.name || item,
                        selected: index === 0 && !all && !optional,
                    }
                })])
            }
        }
    }, [options])

    // useEffect(() => {
    // 	setSelected(value)
    // },[value])



    const renderOptions = useCallback(() => {
        if (currentOptions.length > 0) {
            return currentOptions.map(item => {
                return <Option keyValue={keyValue} multiNames={multiNames} item={item}/>
            })
        }
    }, [currentOptions])


    // const onChangedSelected = (value) => {
    // 	setCurrentOptions(options => options.map(item => {
    // 		if (Number.isInteger(item.value) && item.value === +value) {
    // 			return {
    // 				...item,
    // 				selected: true
    // 			}
    // 		} else if (item.value === value) {
    // 			return {
    // 				...item,
    // 				selected: true
    // 			}
    // 		}
    // 		return {...item,selected:false}
    // 	}))
    // 	setSelected(value)
    // }


    return (
        <label style={style} htmlFor={name} className={styles.selectLabel}>
            {
                title ?
                    <div className={styles.info}>
                        <span>{title}</span>
                        <span>{subTitle}</span>
                    </div> : null
            }

            {
                type === "simple" ?
                    <>
                        {
                            register ?
                                <select
                                    disabled={disabled}
                                    className={classNames(styles.select, extraClassName, {
                                        [styles.error]: errors?.[name]
                                    })}
                                    {...register(name, {
                                        pattern: pattern,
                                        placeholder: placeholder,
                                        required: required,
                                    })}
                                    onChange={onChange ? e => onChange(e?.target?.value) : null}
                                    name={name}
                                    id={name}
                                    value={value}
                                >
                                    {
                                        defaultOption ?
                                            <option value={defaultOption}>
                                                {defaultOption}
                                            </option> : null
                                    }
                                    {renderOptions()}
                                </select>
                                :
                                <select
                                    disabled={disabled}
                                    className={classNames(styles.select, extraClassName, {
                                        [styles.error]: errors?.[name]
                                    })}
                                    value={value}
                                    required={required}
                                    placeholder={placeholder}
                                    onChange={e => onChange(e?.target?.value)}
                                    name={name}
                                    id={name}
                                >
                                    {renderOptions()}
                                </select>
                        }
                    </>
                    : null
            }
            {
                errors?.[name] &&
                <div className={styles.message}>
					<span className={styles.message__error}>
						{errors?.[name].message}
					</span>
                </div>
            }

        </label>
    );
})


const Option = ({item,multiNames,keyValue}) => {
    if (typeof item === "object") {
        return (
            <option
                disabled={item?.disabled}
                value={item[keyValue] || item.value || item.id || item.name}
            >
                {
                    multiNames.length
                        ?
                        multiNames.map(name => {
                            return ` ${item[name]}`
                        })
                        :
                        item.name ? item.name : item.value
                }

            </option>
        )
    }
    return (
        <option
            value={item}
        >
            {item}
        </option>
    )
}

export default Select;