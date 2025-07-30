import React from 'react';
import {activeTypesSideBar} from "components/presentation/types/index";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {useSelector} from "react-redux";
import TextSlide from "components/presentation/ui/text/TextSlide";
import cls from "./imageType.module.sass"

export const ImageContent = () => {


    const {currentSlide: {image,imageType,heading,label,design}} = useSelector(state => state.presentation)


    console.log(imageType, "imageTypes")

    return (
        <div className={cls.imageContent}>

            {imageType === "center" &&
                <div className={cls.image}>
                    <img src={image} alt={label} className={""}/>
                </div>
            }


            <div className={cls.text} style={{backgroundColor: design.backgroundColor}}>
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

