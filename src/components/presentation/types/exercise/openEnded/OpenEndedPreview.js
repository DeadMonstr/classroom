import React, {useEffect, useState} from 'react';

import cls from "components/presentation/types/exercise/openEnded/openEndedType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {OpenEndedTOptionsSlice} from "./OpenEndedType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";


export const OpenEndedPreview = () => {


    const {currentSlide: {design, exercise, heading, subheading}} = useSelector(state => state.presentation)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(OpenEndedTOptionsSlice))
    }, [])



    const words = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        text: `Word${i + 1}`
    }));

    const renderSentences = (sentences) => {
        return sentences.map(item => {
            return (
                <div style={{color: design.fontColor }} className={cls.sentence}>
                    {item.text}
                </div>
            )
        })
    }


    return (
        <ActiveBox type={activeTypesSideBar.openEnded}>
            <div className={cls.openEnded}>
                <div className={cls.text}>
                    <ContainerSlide>
                        <TextSlide type={"small"}>
                            Subheading
                        </TextSlide>
                        <TextSlide type={"normal"} style={{fontWeight: "bold"}}>
                            Heading
                        </TextSlide>
                    </ContainerSlide>
                </div>


                <div className={cls.sentences}>
                    {renderSentences(words)}


                </div>


            </div>
        </ActiveBox>

    );
};

