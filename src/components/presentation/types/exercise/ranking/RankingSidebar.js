import React, {useContext} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";

import {PresentationSidebarContext} from "helpers/contexts";


import {rankingType} from "components/presentation/types/exercise/ranking/RankingType";
import {useDispatch, useSelector} from "react-redux";
import {setContentHeading, setContentSubheading, setExerciseOptionSlide} from "slices/presentationSlice";
import VariantsSlide from "components/presentation/ui/variants/VariantsSlide";
import OptionSwitcherSlide from "components/presentation/ui/optionSwitcher/OptionSwitcherSlide";
import OptionInputSlide from "components/presentation/ui/optionInput/optionInputSlide";
import {getRandomColor} from "helpers/colorRandomizer";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {makeIconComponent} from "helpers/makeIconComponent";

export const RankingSidebar = () => {


    const {setActiveModal} = useContext(PresentationSidebarContext)
    const {currentSlide} = useSelector(state => state.presentation)

    const {heading,subheading,exercise} = currentSlide
    const {variants,correctAnswer} = exercise

    const dispatch = useDispatch()

    const onAddVariant = () => {
        if (variants.length < 10) {
            dispatch(setExerciseOptionSlide({
                variants: [...variants, {
                    id: variants.length + 1,
                    name: "",
                    correct: false,
                    value: 0,
                    color: getRandomColor()
                }]
            }))
        }
    }

    const onChangeVariant = (changeditem) => {
        dispatch(setExerciseOptionSlide({
            variants: variants.map(item => {
                if (item.id === changeditem.id) {
                    return changeditem
                }
                return item
            })
        }))
    }

    const onDeleteVariant = (id) => {
        dispatch(setExerciseOptionSlide({
            variants: variants.filter(item => item.id !== id)
        }))
    }

    const onChangeHeading = (e) => {
        dispatch(setContentHeading(e))
    }

    const onChangeSubheading = (e) => {
        dispatch(setContentSubheading(e))
    }




    return (
        <div className={cls.sidebar}>

            <div className={cls.type}>

                <h2>Slide type</h2>

                <Button
                    onClick={() => setActiveModal(true)}
                    type={"present"}
                    extraClass={cls.type__btn}
                >
                    {makeIconComponent(rankingType.icon)}
                    {rankingType.title}
                </Button>
            </div>
            <div className={cls.separator}/>

            <Input value={heading} onChange={onChangeHeading} extraClassNameLabel={cls.heading} title={"Heading"}/>


            <Textarea value={subheading} onChange={onChangeSubheading} extraClassNameLabel={cls.subheading} title={"Subheading"}/>


            {
                variants &&
                <VariantsSlide
                    haveCorrect={correctAnswer}
                    variants={variants}
                    onAdd={onAddVariant}
                    onChange={onChangeVariant}
                    onDelete={onDeleteVariant}
                />
            }
            {/*<div className={cls.separator}/>*/}
            {/*<OptionSwitcherSlide*/}
            {/*    title={"Correct answer"}*/}
            {/*    onToggle={onChangeCorrectAnswer}*/}
            {/*    active={correctAnswer}*/}
            {/*/>*/}

            {/*<OptionSwitcherSlide title={"live responses"}/>*/}




        </div>
    );
};



