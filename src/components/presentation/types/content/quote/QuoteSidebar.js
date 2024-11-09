import React, {useContext, useState} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {Switch} from "components/ui/switch/switch";
import ImageModal from "components/presentation/ui/imageModal/ImageModal";
import {PresentationSidebarContext} from "helpers/contexts";
import {quoteType} from "./quoteType";

export const QuoteSidebar = () => {

    const [label,setLabel  ] = useState({
        active: false,
        label: null
    })

    const {setActiveModal} = useContext(PresentationSidebarContext)

    const toggleLabel = (type,value) => {
        setLabel(state => ({...state,[type]: value}))
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
                    {quoteType.icon}
                    Quote
                </Button>
            </div>


            <div className={cls.separator}/>

            <Input extraClassNameLabel={cls.heading} title={"Who"}/>


            <Textarea extraClassNameLabel={cls.subheading} title={"Quote"}/>


            <div className={cls.separator} />


            <div className={cls.label}>
                <div className={cls.info}>
                    <h2>Label</h2>
                    <Switch switchOn={label.active} setSwitchOn={(e) => toggleLabel("active",e)}/>
                </div>

                {label.active && <Input onChange={e => toggleLabel("label",e)} extraClassNameLabel={cls.input} /> }
            </div>

            <div className={cls.separator} />

            <ImageModal/>

        </div>
    );
};



