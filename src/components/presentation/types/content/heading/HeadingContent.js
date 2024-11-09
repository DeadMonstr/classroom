import cls from "../../typesContent.module.sass";
import React from "react";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import TextSlide from "components/presentation/ui/text/TextSlide";
import {useSelector} from "react-redux";

export const HeadingContent = () => {


    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,label,subheading} = currentSlide




    return (
        <ContainerSlide>
            <TextSlide extraClass={cls.label} type={"small"}>
                {label}
            </TextSlide>
            <TextSlide type={"extraBig"}>
                Sarik
            </TextSlide>
            <TextSlide type={"big"}>
                {heading}
            </TextSlide>
            <TextSlide type={"normal"}>
                {subheading}
            </TextSlide>
        </ContainerSlide>

    );
};


