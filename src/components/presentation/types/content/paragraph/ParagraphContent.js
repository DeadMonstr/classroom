import React from 'react';
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import TextSlide from "components/presentation/ui/text/TextSlide";
import cls from "components/presentation/types/typesContent.module.sass";
import {useSelector} from "react-redux";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";

export const ParagraphContent = () => {

    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,label,subheading} = currentSlide



    return (
        <ActiveBox type={activeTypesSideBar.paragraph}>

            <ContainerSlide>
                <TextSlide extraClass={cls.label} type={"smaller"}>
                    {label}
                </TextSlide>
                <TextSlide type={"normal"}>
                    {heading}
                </TextSlide>
                <TextSlide >
                    {subheading}
                </TextSlide>
            </ContainerSlide>
        </ActiveBox>

    );
};

