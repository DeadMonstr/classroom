import React, {createContext, useCallback, useState} from "react";
import classNames from "classnames";

import cls from "./sidebar.module.sass"

import {ReactComponent as Design} from "assets/icons/design.svg"
import {ReactComponent as Content} from "assets/icons/Edit 2.svg"
import Modal from "components/ui/modal";
import {contentTypes} from "components/presentation/types";


import DesignSidebar from "components/presentation/sidebar/designSidebar/designSidebar";
import {useDispatch, useSelector} from "react-redux";
import {toggleSidebar} from "slices/presentationSlice";


const menuOptions = [
    {
        name: 'edit',
        title: 'Edit',
        icon: <Content/>
    },
    // {
    //     name: 'design',
    //     title: 'Design',
    //     icon: <Design/>
    // }
]

const Sidebar = () => {


    const {currentSlide: {activeSidebar}} = useSelector(state => state.presentation)

    // const [activeMenu,setActiveMenu] = useState("edit")
    //
    // const toggleActiveMenu = useCallback((name) => {
    //     if (name === activeMenu) {
    //         setActiveMenu(null)
    //     } else {
    //         setActiveMenu(name)
    //     }
    // },[activeMenu])


    const dispatch = useDispatch()

    const toggleActiveMenu = (name) => {
        dispatch(toggleSidebar(name))
    }

    const onDisableMenu = () => {
        dispatch(toggleSidebar(null))
    }


    return (
        <div
            className={classNames(cls.sidebar__right, {
                [cls.active]: activeSidebar
            })}
        >
            <div className={cls.sidebar__wrapper}>
                <div className={cls.container}>
                    <div className={cls.title}>
                        <h1>
                            {activeSidebar && menuOptions.filter(item => item.name === activeSidebar)[0]?.title}
                        </h1>
                        <i onClick={onDisableMenu} className="fa-solid fa-xmark"></i>
                    </div>

                    {activeSidebar === "edit" ? <Edit/> : null}

                </div>
            </div>
            <div className={cls.menu}>
                {
                    menuOptions.map(item => {
                        return (
                            <div
                                className={classNames(cls.menu__item, {
                                    [cls.active]: activeSidebar === item.name
                                })}
                                onClick={() => toggleActiveMenu(item.name)}
                            >
                                {item.icon}
                                <h1>{item.title}</h1>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


const Edit = () => {

    const [activeModal, setActiveModal] = useState(false)


    const {currentSlide: {activeType}} = useSelector(state => state.presentation)


    const renderSidebarOptions = useCallback(() => {
        return contentTypes.map(item => {
            if (activeType === "layout") {
                return <DesignSidebar/>
            }

            if (item.name === activeType) {
                const SideBar = item.sidebar

                return SideBar ? <SideBar/> : null;
            }
        })
    }, [activeType])


    return (
        <>
            {renderSidebarOptions()}
        </>
    )
}


export default Sidebar