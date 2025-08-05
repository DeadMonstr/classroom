import React from 'react';

import cls from "./optionInputSlide.module.sass"
import Input from "components/ui/form/input";


const OptionInputSlide = ({title,onChange,value,type,max,min}) => {
    return (
        <div className={cls.optionInput}>

            <h1>{title}</h1>

            <Input
                onChange={onChange}
                value={value}
                extraClassNameLabel={cls.input}
                type={type}
                max={max}
                min={min}

            />

        </div>
    );
};

export default OptionInputSlide;