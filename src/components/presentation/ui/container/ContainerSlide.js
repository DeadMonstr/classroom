import React, {useEffect, useState} from 'react';

import cls from "./containerSlide.module.sass"
import {useSelector} from "react-redux";

const ContainerSlide = ({children}) => {

    const {currentSlide} = useSelector(state => state.presentation)


    const [align,setAlign] = useState("")


    useEffect(() => {
        if (currentSlide.extraDesign.verticalAlign && currentSlide.design.verticalAlign) {
            setAlign(currentSlide.extraDesign.verticalAlign)
        } else {
            setAlign(currentSlide.design.verticalAlign)

        }
    },[currentSlide.design.verticalAlign, currentSlide.extraDesign.verticalAlign])



    const alignType =
        align === "center" ? 'center' :
            align === "top" ? 'flex-start':
                align === "bottom" ? 'flex-end'
                    : null




    return (
        <div className={cls.container} style={{justifyContent: alignType}}>
            {children}
        </div>
    );
};

export default ContainerSlide;