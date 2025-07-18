import React from 'react';
import ContainerSlide from "../../../ui/container/ContainerSlide";
import TextSlide from "../../../ui/text/TextSlide";
import cls from "../../typesContent.module.sass";

export const HeadingPreview = () => {
    return (

        <ContainerSlide>
            <TextSlide extraClass={cls.label} type={"small"}>
                Label
            </TextSlide>
            <TextSlide type={"extraBig"}>
                Extra big
            </TextSlide>
            <TextSlide type={"big"}>
                Big
            </TextSlide>
            <TextSlide type={"normal"}>
                Subheading
            </TextSlide>
        </ContainerSlide>
    );
};

