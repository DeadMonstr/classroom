import React, {useContext} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";

import {PresentationSidebarContext} from "helpers/contexts";


import {multipleChoiceType} from "./MultipleChoiceType";
import {useDispatch, useSelector} from "react-redux";
import {setExerciseOptionSlide} from "slices/presentationSlice";
import VariantsSlide from "components/presentation/ui/variants/VariantsSlide";
import OptionSwitcherSlide from "components/presentation/ui/optionSwitcher/OptionSwitcherSlide";
import OptionInputSlide from "components/presentation/ui/optionInput/optionInputSlide";
import {getRandomColor} from "helpers/colorRandomizer";

export const MultipleChoiceSidebar = () => {


    const {setActiveModal} = useContext(PresentationSidebarContext)
    const {currentSlide} = useSelector(state => state.presentation)

    const {variants,correctAnswer,multipleOptions,count} = currentSlide.exercise

    const dispatch = useDispatch()

    const onAddVariant = () => {
        if (variants.length < 10) {
            dispatch(setExerciseOptionSlide({
                variants: [...variants, {
                    id: variants.length + 1,
                    name: "",
                    correct: false,
                    value: 1,
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

    const onChangeCorrectAnswer = () => {
        dispatch(setExerciseOptionSlide({
            correctAnswer: !correctAnswer,
            variants: variants.map(item => ({...item,correct: false}))
        }))
    }


    const onChangeMultipleOptions = () => {
        dispatch(setExerciseOptionSlide({
            multipleOptions: !multipleOptions,

        }))
    }

    const onChangeCount = (count) => {
        dispatch(setExerciseOptionSlide({
            count
        }))
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
                    {/*{makeIconComponent(multipleChoiceType.icon)}*/}
                    {multipleChoiceType.title}
                </Button>
            </div>
            <div className={cls.separator}/>
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
            <div className={cls.separator}/>
            <OptionSwitcherSlide
                title={"Correct answer"}
                onToggle={onChangeCorrectAnswer}
                active={correctAnswer}
            />
            <br/>
            <OptionSwitcherSlide
                onToggle={onChangeMultipleOptions}
                active={multipleOptions}
                title={"Multiple options"}
            >
                <OptionInputSlide
                    title={"Count"}
                    value={count}
                    onChange={onChangeCount}
                    type={"number"}
                    max={variants.length}
                    min={1}
                />
            </OptionSwitcherSlide>
            <br/>
            {/*<OptionSwitcherSlide title={"live responses"}/>*/}




        </div>
    );
};



