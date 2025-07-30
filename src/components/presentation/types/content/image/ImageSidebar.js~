import React, {useContext, useState} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";
import Input from "components/ui/form/input";

import {Switch} from "components/ui/switch/switch";
import ImageModal from "components/presentation/ui/imageModal/ImageModal";
import {PresentationSidebarContext} from "helpers/contexts";

import Radio from "components/ui/form/radio";
import Label from "components/presentation/ui/label/Label";
import {useDispatch, useSelector} from "react-redux";
import {setContentHeading, setSlideImageType} from "slices/presentationSlice";
import {imageType} from "./imageType";


const types = [
    {
        name: "center",
        title: "Center"
    },
    {
        name: "fullScreen",
        title: "Full screen"
    }
]


export const ImageSidebar = () => {


    const {setActiveModal} = useContext(PresentationSidebarContext)
    const {currentSlide} = useSelector(state => state.presentation)


    const dispatch = useDispatch()

    const {heading, imageType: type} = currentSlide


    const onChangeHeading = (e) => {
        dispatch(setContentHeading(e))
    }

    const onChangeImageType = (e) => {
        dispatch(setSlideImageType(e))
    }


    console.log(type)
    return (
        <div className={cls.sidebar}>

            <div className={cls.type}>

                <h2>Slide type</h2>

                <Button
                    onClick={() => setActiveModal(true)}
                    type={"present"}
                    extraClass={cls.type__btn}
                >
                    {imageType.icon}
                    Image
                </Button>
            </div>


            <div className={cls.separator}/>

            <Input value={heading} onChange={onChangeHeading} extraClassNameLabel={cls.heading}
                   title={"Image caption"}/>


            <div className={cls.variants}>
                <h2>
                    Image type
                </h2>

                <div className={cls.variants__wrapper}>
                    {
                        types.map(item => {
                            return (
                                <div className={cls.variants__item}>
                                    <Radio
                                        checked={type === item.name}
                                        name={"type"}
                                        onChange={() => onChangeImageType(item.name)}
                                        extraClassname={cls.radio}
                                    >
                                        {item.name}
                                    </Radio>
                                </div>
                            )
                        })
                    }
                </div>
            </div>


            <div className={cls.separator}/>


            <Label/>

            <div className={cls.separator}/>

            <ImageModal/>

        </div>
    );
};



