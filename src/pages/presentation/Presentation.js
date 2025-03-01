import React, {useCallback, useState} from 'react';

import cls from "./Presentation.module.sass"
import Button from "components/ui/button";

import classNames from "classnames";

import {NavLink} from "react-router-dom";

import TypesPreview from "components/presentation/ui/typesPreview/TypesPreview";
import Modal from "components/ui/modal";
import {typesPresentation} from "components/presentation/types";
import {useSelector} from "react-redux";
import Popup from "components/ui/popup/Popup";
import Tooltip from "components/ui/tooltip/Tooltip";

import Content from "components/presentation/content/Content";
import Sidebar from "components/presentation/sidebar/Sidebar";






const Presentation = () => {

    const [addNewSlide,setAddNewSlide] = useState(false)

    const {slides,currentSlide} = useSelector(state => state.presentation)


    const renderSlides = useCallback(() => {
        return slides.map((item,index) => {
            return (
                <div
                    className={classNames(cls.tabs__item, {
                        [cls.active]: currentSlide.id === item.id
                    })}
                >
                    <div className={cls.num}>
                        {index + 1}
                    </div>

                    <div className={cls.info}>

                        {
                            typesPresentation.filter(type => type.name === item.name)[0].icon
                        }

                        <Tooltip>
                            {item.heading}
                        </Tooltip>
                        {/*<div className={cls.tooltip}>*/}
                        {/*    item.heading*/}
                        {/*</div>*/}
                    </div>

                </div>
            )
        })
    },[slides,currentSlide])



    return (
        <div className={cls.presentation}>

            <div className={cls.header}>
                <div className={cls.header__item}>
                    <div className={cls.back}>
                        <i className="fa-solid fa-arrow-left"></i>

                    </div>

                    <div className={cls.title}>
                        <h1>Title</h1>
                        <h3>My presentation</h3>
                    </div>
                </div>
                <div className={cls.header__item}>
                    <div className={cls.icon}>
                        <i className="fa-solid fa-gear"></i>
                    </div>
                    <div className={cls.icon}>
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    <Button
                        type={"present"}
                    >
                        <i style={{fontSize: '1.5rem'}} className="fa-solid fa-play"></i>
                        <span>Present</span>
                    </Button>
                </div>
            </div>

            <div className={cls.wrapper}>
                <div className={cls.sidebar__left}>

                    <Button
                        onClick={() => setAddNewSlide(true)}
                        type={"present"}
                    >
                        <i style={{fontSize: '1.5rem'}} className="fa-solid fa-plus"></i>
                        <span>New slide</span>
                    </Button>

                    <div className={cls.tabs}>

                        {renderSlides()}


                    </div>

                </div>



                <Content/>

                <Sidebar/>
            </div>


            <Modal
                type={"other"}
                active={addNewSlide}
                setActive={setAddNewSlide}
            >
                <TypesPreview />
            </Modal>


        </div>
    );
};




export default Presentation;