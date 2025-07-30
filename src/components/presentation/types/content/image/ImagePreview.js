import React from 'react';
import TextSlide from "../../../ui/text/TextSlide";
import cls from "./imageType.module.sass";
import {useSelector} from "react-redux";

export const ImagePreview = () => {
    const {currentSlide: {image,imageType,heading,label,design}} = useSelector(state => state.presentation)


    return (
        <div className={cls.imageContent}>

            <div className={cls.image}>
                <img src={image} alt={label} className={""}/>
            </div>


            <div className={cls.text} >
                <TextSlide extraClass={cls.label} type={"small"}>
                    {label}
                </TextSlide>

                <TextSlide  extraClass={cls.label} type={"normal"}>
                    {heading}
                </TextSlide>
            </div>

        </div>
    );
};

