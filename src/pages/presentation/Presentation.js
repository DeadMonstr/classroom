import React, {useCallback, useState} from 'react';

import cls from "./Presentation.module.sass"
import Button from "components/ui/button";

import classNames from "classnames";

import TypesPreview from "components/presentation/ui/typesPreview/TypesPreview";
import Modal from "components/ui/modal";
import {contentTypes} from "components/presentation/types";
import {useSelector} from "react-redux";
import Tooltip from "components/ui/tooltip/Tooltip";



import Content from "components/presentation/content/Content";
import Sidebar from "components/presentation/sidebar/Sidebar";



import {PresentationSidebarContext} from "helpers/contexts";
import Popup from "components/ui/popup/Popup";



const Presentation = () => {

    const [addNewSlide,setAddNewSlide] = useState(false)
    const [modalType,setModalType] = useState("add")

    const {slides} = useSelector(state => state.presentation)


    const onChangeSlideType = () => {
        setAddNewSlide(true)
        setModalType("change")
    }


    const onAddSlide = () => {
        setAddNewSlide(true)
        setModalType("add")
    }



    const renderSlides = useCallback(() => {
        return slides.map((item,index) => {

            return (
                <Slide item={item} index={index}/>
            )
        })
    },[slides])



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
                        onClick={onAddSlide}
                        type={"present"}
                    >
                        <i style={{fontSize: '1.5rem'}} className="fa-solid fa-plus"></i>
                        <span>New slide</span>
                    </Button>

                    <div className={cls.tabs}>
                        {renderSlides()}
                    </div>
                </div>

                <div className={cls.contentArea}>
                    <Content />
                </div>


                <PresentationSidebarContext.Provider
                    value={{setActiveModal: onChangeSlideType}}
                >
                    <Sidebar/>
                </PresentationSidebarContext.Provider>

            </div>


            <Modal
                type={"other"}
                active={addNewSlide}
                setActive={setAddNewSlide}
            >
                <TypesPreview
                    active={addNewSlide}
                    setActive={setAddNewSlide}
                    type={modalType}
                />
            </Modal>


        </div>
    );
};


const Slide = ({item,index}) => {
    const Icon = contentTypes.filter(type => type.name === item.name)[0].icon
    const {currentSlide} = useSelector(state => state.presentation)


    const popupOptions = [
        {
            // onClick: onChange,
            children: (
                <>
                    <span><i className="fa-solid fa-copy"></i></span>
                    <span>Duplicate Slide</span>
                </>
            )
        },
        {
            // onClick: onDel,
            children: (
                <>
                    <span><i style={{color: 'red'}} className="fa-solid fa-trash"></i></span>
                    <span style={{textWrap: "nowrap"}}>Delete slide</span>
                </>
            )
        }
    ]

    return (
        <div
            className={classNames(cls.tabs__item, {
                [cls.active]: currentSlide.id === item.id
            })}
        >
            <div className={cls.controller}>
                <div className={cls.num}>
                    {index + 1}
                </div>

                <div className={cls.menu}>
                    <Popup styles={{optionsWidth: "20rem"}} trigger={<i className="fa-solid fa-ellipsis"></i>} options={popupOptions}/>
                </div>
            </div>


            <div className={cls.info}>
                {Icon ? <Icon/> : ''}


                <Tooltip>
                    {item.heading}
                </Tooltip>

            </div>
        </div>
    )
}




export default Presentation;