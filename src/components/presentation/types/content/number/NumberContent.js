import React from 'react';
import {useSelector} from "react-redux";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import TextSlide from "components/presentation/ui/text/TextSlide";
import cls from "components/presentation/types/typesContent.module.sass";

export const NumberContent = () => {
    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,label,subheading} = currentSlide



    return (
        <ContainerSlide>
            <TextSlide extraClass={cls.label} type={"smaller"}>
                {label}
            </TextSlide>
            <TextSlide type={"extraBig"}>
                {heading}
            </TextSlide>
            <TextSlide >
                {subheading}
            </TextSlide>
        </ContainerSlide>
    );
};

