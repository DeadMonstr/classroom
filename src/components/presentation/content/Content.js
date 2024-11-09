import React, {useEffect, useState} from 'react';
import cls from "./content.module.sass";
import {HeadingContent, NumberContent, ParagraphContent} from "components/presentation/types";
import {useSelector} from "react-redux";
import classNames from "classnames";
import {BackUrlForDoc} from "constants/global";



const layoutSizeTypes = [
    {
        id: 0,
        size: "10%"
    },
    {
        id: 1,
        size: "20%"
    },
    {
        id: 2,
        size: "30%"
    },
    {
        id: 3,
        size: "40%"
    },
    {
        id: 4,
        size: "50%"
    },
]



const Content = () => {

    const {currentSlide} = useSelector(state => state.presentation)

    const [layout, setLayout] = useState("")
    const [layoutSizeWidth, setLayoutSizeWidth] = useState("")
    const [layoutSizeHeight, setLayoutSizeHeight] = useState("")
    const [image, setImage] = useState("")
    const [bgColor, setBgColor] = useState("")


    useEffect(() => {
        if (currentSlide.extraDesign.layout && currentSlide.design.layout) {
            console.log("uraaaaaa")
            setLayout(currentSlide.extraDesign.layout)
            setLayoutSizeHeight("")
            setLayoutSizeWidth("")
        } else {
            setLayout(currentSlide.design.layout)
        }
    }, [currentSlide.design.layout, currentSlide.extraDesign.layout])

    useEffect(() => {
        if (currentSlide.extraDesign.layout) return

        if (
            currentSlide.design.layout === "fullLeft" ||
            currentSlide.design.layout === "fullRight" ||
            currentSlide.design.layout === "top" ||
            currentSlide.design.layout === "bottom"
        ) {
            console.log("uraa 2")
            if (currentSlide.design.layout === "top" || currentSlide.design.layout === "bottom") {
                setLayoutSizeHeight(layoutSizeTypes.filter(item => item.id === currentSlide.design.layoutSize)[0].size)
                setLayoutSizeWidth("")
            } else {
                setLayoutSizeWidth(layoutSizeTypes.filter(item => item.id === currentSlide.design.layoutSize)[0].size)
                setLayoutSizeHeight("")
            }
        }
    },[currentSlide.design.layout,currentSlide.design.layoutSize,currentSlide.extraDesign.layout])


    useEffect(() => {
        setImage(currentSlide.image)
    },[currentSlide.image])

    useEffect(() => {
        setBgColor(currentSlide.design.backgroundColor)
    },[currentSlide.design.backgroundColor])



    return (
        <div
            className={classNames(cls.main, cls[layout])}
        >
            {
                layout !== "default" &&
                <div
                    style={{minWidth: layoutSizeWidth,maxWidth: layoutSizeWidth, minHeight: layoutSizeHeight, maxHeight: layoutSizeHeight}}
                    className={cls.image}
                >
                    <img src={image} alt=""/>
                </div>

            }


            <div className={cls.content} style={{backgroundColor: bgColor}}>
                {/*<HeadingContent/>*/}
                {/*<ParagraphContent/>*/}
                <NumberContent/>
            </div>

        </div>
    );
};

export default Content;