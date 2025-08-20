import React, {useEffect, useState} from 'react';

import cls from "./dimension.module.sass"
import Input from "components/ui/form/input";

const Dimension = (props) => {

    const {
        titleText,
        valueText,
        placeholderTitle,
        placeholderValue,
        defaultValue,
        defaultTitle,
        max,
        min,
        onChange
    } = props


    const [title,setTitle] = useState(null)
    const [value,setValue] = useState(null)


    useEffect(() => {
        if (title || value)  {
            onChange({title,value})
        }
    },[title,value])


    return (
        <div className={cls.dimension}>
            <Input
                placeholder={placeholderTitle}
                title={titleText}
                extraClassNameLabel={cls.left}
                onChange={setTitle}
                defaultValue={defaultTitle}
            />
            <Input
                type={"number"}
                placeholder={placeholderValue}
                title={valueText}
                extraClassNameLabel={cls.value}
                onChange={setValue}
                defaultValue={defaultValue}
                max={max}
                min={min}
            />
        </div>
    );
};

export default Dimension;