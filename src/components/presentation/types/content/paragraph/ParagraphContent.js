import React from 'react';
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import TextSlide from "components/presentation/ui/text/TextSlide";
import cls from "components/presentation/types/typesContent.module.sass";
import {useSelector} from "react-redux";

export const ParagraphContent = () => {

    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,label,subheading} = currentSlide



    return (
        <ContainerSlide>
            <TextSlide extraClass={cls.label} type={"smaller"}>
                {label}
            </TextSlide>
            <TextSlide type={"big"}>
                {heading}
            </TextSlide>
            <TextSlide >
                {subheading}
            </TextSlide>
        </ContainerSlide>
    );
};

