import React, {useContext} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";

import {PresentationSidebarContext} from "helpers/contexts";


import {wordCloudType} from "components/presentation/types/exercise/wordCloud/WordCloudType";
import {useDispatch, useSelector} from "react-redux";
import {setContentHeading, setContentSubheading, setExerciseOptionSlide} from "slices/presentationSlice";
import OptionSwitcherSlide from "components/presentation/ui/optionSwitcher/OptionSwitcherSlide";
import OptionInputSlide from "components/presentation/ui/optionInput/optionInputSlide";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {makeIconComponent} from "helpers/makeIconComponent";

export const WordCloudSidebar = () => {


    const {setActiveModal} = useContext(PresentationSidebarContext)
    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,subheading,exercise} = currentSlide

    const {variants,multipleOptions,count} = exercise

    const dispatch = useDispatch()






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
                    {makeIconComponent(wordCloudType.icon)}
                    {wordCloudType.title}
                </Button>
            </div>
            <div className={cls.separator}/>
            <Input value={heading} onChange={onChangeHeading} extraClassNameLabel={cls.heading} title={"Heading"}/>
            <Textarea value={subheading} onChange={onChangeSubheading} extraClassNameLabel={cls.subheading} title={"Subheading"}/>

            <div className={cls.separator}/>

            <br/>
            <OptionSwitcherSlide
                onToggle={onChangeMultipleOptions}
                active={multipleOptions}
                title={"Multiple Answers"}
            >
                <OptionInputSlide
                    title={"Count"}
                    value={count}
                    onChange={onChangeCount}
                    type={"number"}
                />
            </OptionSwitcherSlide>
            <br/>
            {/*<OptionSwitcherSlide title={"live responses"}/>*/}




        </div>
    );
};



