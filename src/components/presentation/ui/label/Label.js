import React, {useEffect, useState} from 'react';
import cls from "components/presentation/ui/label/label.module.sass";
import {Switch} from "components/ui/switch/switch";
import Input from "components/ui/form/input";
import {useDispatch, useSelector} from "react-redux";
import {setContentLabel} from "slices/presentationSlice";

const Label = () => {

    const [label,setLabel] = useState(false)

    const {currentSlide} = useSelector(state => state.presentation)

    const toggleLabel = () => {
        setLabel(state => !state)
    }

    const dispatch = useDispatch()
    const onChangeLabel= (e) => {
        dispatch(setContentLabel(e))
    }


    useEffect(() => {
        if (!label) {
            console.log("hello")
            dispatch(setContentLabel(""))
        }
    },[label])


    return (
        <div className={cls.label}>
            <div className={cls.info}>
                <h2>Label</h2>
                <Switch switchOn={label} setSwitchOn={toggleLabel}/>
            </div>

            {label && <Input value={currentSlide.label}  onChange={onChangeLabel} extraClassNameLabel={cls.input} /> }
        </div>
    );
};

export default Label;