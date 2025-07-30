import {useSelector} from "react-redux";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import TextSlide from "components/presentation/ui/text/TextSlide";
import cls from "components/presentation/types/typesContent.module.sass";
import React from "react";

export const ParagraphPreview = () => {

    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,label,subheading} = currentSlide



    return (
        <ContainerSlide>
            <TextSlide extraClass={cls.label} type={"smaller"}>
                label
            </TextSlide>
            <TextSlide type={"big"}>
                Paragraph
            </TextSlide>
            <TextSlide >
                subheading
            </TextSlide>
        </ContainerSlide>


    );
};
