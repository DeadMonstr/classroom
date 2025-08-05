import React, {useEffect} from 'react';

import cls from "./multipleChoiceType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import BarChart from "components/ui/charts/barChart";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {MultipleChoiceOptionsSlice} from "./MultipleChoiceType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";


export const MultipleChoiceContent = () => {


    const {currentSlide: {design,exercise}} = useSelector(state => state.presentation)



    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(MultipleChoiceOptionsSlice))
    },[])




    return (
        <ActiveBox type={activeTypesSideBar.multipleChoice}>
            <div className={cls.multipleChoice}>
                <div className={cls.text}>
                    <ContainerSlide>
                        <TextSlide type={"small"}>
                            Subheading
                        </TextSlide>
                        <TextSlide type={"normal"} style={{fontWeight: "bold"}}>
                            HI, What is my name
                        </TextSlide>
                    </ContainerSlide>
                </div>




                <div className={cls.charts}>
                    <BarChart
                        isCreating={true}
                        isCorrect={exercise.correctAnswer}
                        textColor={design.fontColor}
                        data={exercise.variants || []}
                    />


                </div>
            </div>
        </ActiveBox>

    );
};

