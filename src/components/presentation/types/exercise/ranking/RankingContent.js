import React, {useEffect} from 'react';

import cls from "./rankingType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import BarChartHorizontal from "components/ui/charts/barChartHorizontal";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {RankingTypeSlice} from "./RankingType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";


export const RankingContent = () => {


    const {currentSlide: {design,exercise,heading,subheading}} = useSelector(state => state.presentation)



    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(RankingTypeSlice))
    },[])




    return (
        <ActiveBox type={activeTypesSideBar.ranking}>
            <div className={cls.ranking}>
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




                <div className={cls.charts}>
                    <BarChartHorizontal
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

