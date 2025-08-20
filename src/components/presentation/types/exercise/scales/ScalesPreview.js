import React, {useEffect} from 'react';

import cls from "./scalesType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import ContainerSlide from "components/presentation/ui/container/ContainerSlide";
import {useDispatch, useSelector} from "react-redux";

import {ScalesTypeTOptionsSlice} from "./ScalesType"
import {setExerciseOptionsSlide} from "slices/presentationSlice";
import StatementSlider from "components/ui/charts/scales";
import StatementVotesChart from "components/ui/charts/scales/scalesVariant2";


export const ScalesPreview = () => {


    const statements = [
        {
            id: 1,
            label: "Statement 1",
            votes: [5, 2],
            color: "blue",
        },
        {
            id: 2,
            label: "Statement 2",
            votes: [4, 4, 3, 5, 2, 1, 0, 4, 4],
            color: "red",
        },
        {
            id: 3,
            label: "Statement 3",
            votes: [4, 4, 3, 5, 2, 1, 0, 4, 4, 2, 5, 3],
            color: "red",
        },

    ];


    return (
        <div className={cls.scales}>
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


            <div className={cls.scales__chart}>
                {/*<StatementSlider statements={statements} width={1000} height={100} />*/}

                <StatementVotesChart
                    width={"300"}
                    height={200}
                    showVoteCounts={false}
                    showIndividualVotes={false}
                    data={statements}
                    margins={{top: 0, right: 0, bottom: 0, left: 0}}
                />
            </div>
        </div>

    );
};





