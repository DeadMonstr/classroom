import React, {useContext, useEffect, useState} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {Switch} from "components/ui/switch/switch";
import ImageModal from "components/presentation/ui/imageModal/ImageModal";
import {PresentationSidebarContext} from "helpers/contexts";
import {quoteType} from "./quoteType";
import {makeIconComponent} from "helpers/makeIconComponent";
import {setContentHeading, setContentSubheading} from "slices/presentationSlice";
import Label from "components/presentation/ui/label/Label";
import {useDispatch} from "react-redux";

export const QuoteSidebar = () => {

    const [label,setLabel  ] = useState({
        active: false,
        label: null
    })

    const {setActiveModal} = useContext(PresentationSidebarContext)

    const toggleLabel = (type,value) => {
        setLabel(state => ({...state,[type]: value}))
    }


    const dispatch = useDispatch()

    const onChangeWho = (e) => {
        dispatch(setContentHeading(e))
    }

    const onChangeQuote = (e) => {
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
                    {makeIconComponent(quoteType.icon)}
                    Quote
                </Button>
            </div>


            <div className={cls.separator}/>

            <Input onChange={onChangeWho} extraClassNameLabel={cls.heading} title={"Who"}/>

            <Textarea onChange={onChangeQuote} extraClassNameLabel={cls.subheading} title={"Quote"}/>

            <div className={cls.separator} />

            <ImageModal/>

        </div>
    );
};



