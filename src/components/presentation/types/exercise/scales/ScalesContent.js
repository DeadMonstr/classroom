import React, {useEffect} from 'react';

import cls from "components/presentation/types/exercise/openEnded/openEndedType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {ScalesTypeTOptionsSlice} from "./ScalesType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";
import StatementSlider from "components/ui/charts/scales";


export const ScalesContent = () => {


    const {currentSlide: {design, exercise, heading, subheading}} = useSelector(state => state.presentation)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(ScalesTypeTOptionsSlice))
    }, [])

    const statements = [
        {
            label: "Statement 1",
            votes: [5, 0],
            color: "blue",
        },
        {
            label: "Statement 2",
            votes: [4, 4, 3, 5, 2 ,1, 0,4,4],
            color: "red",
        },
        {
            label: "Statement 3",
            votes: [4, 4, 3, 5, 2 ,1, 0,4,4],
            color: "red",
        },
        {
            label: "Statement 4",
            votes: [4, 4, 3, 5, 2 ,1, 0,4,4],
            color: "red",
        },
    ];


    return (
        <ActiveBox type={activeTypesSideBar.openEnded}>
            <div className={cls.scales}>
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


                <div className={cls.scales__chart}>
                    <StatementSlider statements={statements} width={1000} height={100} />



                </div>


            </div>
        </ActiveBox>

    );
};

