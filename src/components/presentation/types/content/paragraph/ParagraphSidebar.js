import React, {useContext, useState} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {Switch} from "components/ui/switch/switch";
import ImageModal from "components/presentation/ui/imageModal/ImageModal";
import {PresentationSidebarContext} from "helpers/contexts";


import {paragraphType} from "./paragraphType";
import Label from "components/presentation/ui/label/Label";
import {useDispatch, useSelector} from "react-redux";
import {setContentHeading, setContentSubheading} from "slices/presentationSlice";



export const ParagraphSidebar = () => {

    const {setActiveModal} = useContext(PresentationSidebarContext)


    const {currentSlide} = useSelector(state => state.presentation)

    const { heading,subheading} = currentSlide



    const dispatch = useDispatch()
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
                    {paragraphType.icon}
                    Paragraph
                </Button>
            </div>


            <div className={cls.separator}/>

            <Input value={heading} onChange={onChangeHeading} extraClassNameLabel={cls.heading} title={"Heading"}/>


            <Textarea value={subheading} onChange={onChangeSubheading} extraClassNameLabel={cls.subheading} title={"Paragraph"}/>


            <div className={cls.separator} />


            <Label/>

            <div className={cls.separator} />

            <ImageModal/>

        </div>
    );
};



