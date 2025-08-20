import React, {useEffect} from 'react';

import cls from "./rankingType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";
import BarChartHorizontal from "components/ui/charts/barChartHorizontal";

export const RankingPreview = () => {


    const {currentSlide: {design,exercise}} = useSelector(state => state.presentation)



    const data = [
        {
            id: 1,
            name: "Option 1",
            value: 20,
            color: "#60be32"
        },
        {
            id: 2,
            name: "Option 2",
            value: 30,
            color: "#3a559f"
        },
        {
            id: 3,
            name: "Option 3",
            value: 50,
            color: "#c81df5"
        },
        {
            id: 4,
            name: "Option 4",
            value: 60,
            color: "#dcec39"
        }
    ]




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
                    <BarChartHorizontal
                        isCreating={true}
                        isCorrect={exercise.correctAnswer}
                        textColor={design.fontColor}
                        data={data}
                    />



                </div>
            </div>
        </ActiveBox>

    );
};

