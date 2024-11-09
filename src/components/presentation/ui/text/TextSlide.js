import React, {useEffect, useState} from 'react';


import cls from "./textSlide.module.sass"
import classNames from "classnames";
import {useSelector} from "react-redux";




const textSizeTypes = [
    {
        id: 0,
        smaller: 14,
        small: 20,
        normal: 25,
        big: 40,
        extraBig: 70
    },
    {
        id: 1,
        smaller: 17,
        small: 23,
        normal: 28,
        big: 50,
        extraBig: 80
    },
    {
        id: 2,
        smaller: 19,
        small: 26,
        normal: 32,
        big: 55,
        extraBig: 100
    },
    {
        id: 3,
        smaller: 22,
        small: 28,
        normal: 34,
        big: 60,
        extraBig: 110
    },
    {
        id: 4,
        smaller: 24,
        small: 30,
        normal: 36,
        big: 65,
        extraBig: 120
    },
]



const TextSlide = ({type="normal" , children, extraClass,style}) => {

    const {currentSlide} = useSelector(state => state.presentation)


    const [align,setAlign] = useState("")
    const [size,setSize] = useState("")
    const [color,setColor] = useState("")


    useEffect(() => {

        if (currentSlide.extraDesign.horizontalAlign && currentSlide.design.horizontalAlign) {
            setAlign(currentSlide.extraDesign.horizontalAlign)
        } else {
            setAlign(currentSlide.design.horizontalAlign)

        }
    },[currentSlide.design.horizontalAlign, currentSlide.extraDesign.horizontalAlign])

    useEffect(() => {
        const filteredSize = textSizeTypes.filter(item => item.id === currentSlide.design.fontSize)[0]
        setSize(filteredSize[type])
    },[currentSlide.design.fontSize])


    useEffect(() => {
        setColor(currentSlide.design.fontColor)
    },[currentSlide.design.fontColor])

    const alignType =
        align === "center" ? 'center' :
        align === "right" ? 'flex-end':
        align === "left" ? 'flex-start'
            : null


    console.log(color)
    return (
        <span
            className={classNames(cls.text, extraClass, cls[type],)}
            style={{...style, justifyContent: alignType,fontSize: size + "px", color: color}}
        >
            {children}
        </span>
    );
};

export default TextSlide;