import React, {useEffect, useState} from 'react';

import cls from "./wordCloudType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import BarChart from "components/ui/charts/barChart";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {WordCloudOptionsSlice} from "./WordCloudType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";
import WordCloud from "components/ui/wordCloud/wordCloud";


export const WordCloudContent = () => {


    const {currentSlide: {design, exercise, heading, subheading}} = useSelector(state => state.presentation)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(WordCloudOptionsSlice))
    }, [])


    const words = Array.from({ length: 20 }, (_, i) => ({
        word: `Word${i + 1}`,
    }));


    return (
        <ActiveBox type={activeTypesSideBar.wordCloud}>
            <div className={cls.wordCloud}>
                <div className={cls.text}>
                    <ContainerSlide>
                        <TextSlide type={"small"}>
                            {subheading}
                        </TextSlide>
                        <TextSlide type={"normal"} style={{fontWeight: "bold"}}>
                            {heading}
                        </TextSlide>
                    </ContainerSlide>
                </div>


                <div className={cls.words}>
                    <WordCloud words={exercise.words || words} orientation={"mixed"}/>
                </div>

                {/*<button onClick={() => setWords([...words, { word: "fast" }])}>*/}
                {/*    Add Word*/}
                {/*</button>*/}
            </div>
        </ActiveBox>

    );
};

