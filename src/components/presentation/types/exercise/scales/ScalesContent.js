import React, {useEffect, useState} from 'react';

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
import Button from "components/ui/button";


export const ScalesContent = () => {


    const {currentSlide: {design, exercise, heading, subheading}} = useSelector(state => state.presentation)

    const {variants,dimensions} = exercise

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setExerciseOptionsSlide(ScalesTypeTOptionsSlice))
    }, [])

    const statementsData = variants?.map(item => ({label: item.name, votes: [], color: item.color, id: item.id})) || []

    const [statements,setStatements] = useState([{
        id: 1,
        label: "Statement 1",
        votes: [15],
        color: "blue",
    },
        {
            id: 2,
            label: "Statement 2",
            votes: [12],
            color: "red",
        },
        {
            id: 3,
            label: "Statement 3",
            votes: [ 5],
            color: "red",
        },
        {
            id: 4,
            label: "Statement 4",
            votes: [4],
            color: "red",
        },])



    const addVote = () => {
        setStatements(statements.map(item => {
            if (item.id === 1) {
                return {
                    ...item,
                    votes: [...item.votes,14]
                }
            }
            if (item.id === 2) {
                return {
                    ...item,
                    votes: [...item.votes,2]
                }
            }
            return item
        }))
    }


    return (
        <ActiveBox type={activeTypesSideBar.scales}>
            <div className={cls.scales}>
                <div className={cls.text}>
                    <ContainerSlide>
                        <TextSlide type={"small"}>
                            {subheading}
                        </TextSlide>
                        <TextSlide
                            type={"normal"}
                            style={{fontWeight: "bold"}}
                        >
                            {heading}
                        </TextSlide>
                    </ContainerSlide>
                </div>



                <div className={cls.scales__chart}>
                    {/*<StatementSlider statements={statements} width={1000} height={100} />*/}
                    {/*<Button onClick={addVote}>Add</Button>*/}
                    <StatementVotesChart
                        width={1000}
                        // height={350}
                        showVoteCounts={false}
                        showIndividualVotes={false}
                        data={statements}
                        margins={{ top: 0, right: 100, bottom: 0, left: 100 }}
                        voteMin={dimensions?.left?.value}
                        voteMax={dimensions?.right?.value}
                    />


                </div>

                <div className={cls.dimensions}>
                    <h1>{dimensions?.left?.title}</h1>
                    <h1>{dimensions?.right?.title}</h1>


                </div>

            </div>
        </ActiveBox>

    );
};

