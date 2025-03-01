import React, {createContext, useCallback, useState} from "react";
import classNames from "classnames";

import cls from "./sidebar.module.sass"

import {ReactComponent as Design} from "assets/icons/design.svg"
import {ReactComponent as Content} from "assets/icons/Edit 2.svg"
import Modal from "components/ui/modal";
import {
    HeadingSidebar,
    ImageSidebar,
    NumberSidebar,
    ParagraphSidebar,
    QuoteSidebar, VideoSidebar,
    typesPresentation, contentTypes
} from "components/presentation/types";



import {PresentationSidebarContext} from "helpers/contexts";
import DesignSidebar from "components/presentation/sidebar/designSidebar/designSidebar";
import TypesPreview from "components/presentation/ui/typesPreview/TypesPreview";
import {useSelector} from "react-redux";


const menuOptions = [
    {
        name: 'content',
        title: 'Content',
        icon: <Content/>
    },
    {
        name: 'design',
        title: 'Design',
        icon: <Design/>
    }
]

const Sidebar = () => {



    const [activeMenu,setActiveMenu] = useState()

    const toggleActiveMenu = useCallback((name) => {
        if (name === activeMenu) {
            setActiveMenu(null)
        } else {
            setActiveMenu(name)
        }
    },[activeMenu])





    return (
        <div
            className={classNames(cls.sidebar__right, {
                [cls.active]: activeMenu
            })}
        >
            <div className={cls.sidebar__wrapper}>
                <div className={cls.container}>
                    <div className={cls.title}>
                        <h1>
                            {activeMenu === "content" ? "Content" : "Design"}
                        </h1>
                        <i onClick={() => setActiveMenu()} className="fa-solid fa-xmark"></i>
                    </div>

                    {activeMenu === "content" ? <ContentOptions/> : <DesignSidebar /> }

                </div>
            </div>
            <div className={cls.menu}>
                {
                    menuOptions.map(item => {
                        return (
                            <div
                                className={classNames(cls.menu__item, {
                                    [cls.active]: activeMenu === item.name
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




const ContentOptions = () => {

    const [activeModal,setActiveModal] = useState(false)


    const {currentSlide: {slideType}} = useSelector(state => state.presentation)


    const renderSidebarOptions = useCallback(() => {

        return contentTypes.map(item => {
            if (item.name === slideType) {
                return item.sidebar
            }
        })



    },[slideType])





    return (
        <>
            <PresentationSidebarContext.Provider value={{setActiveModal}}>

                {}

                {/*<HeadingSidebar />*/}
                {/*/!*<ImageSidebar />*!/*/}
                {/*/!*<NumberSidebar />*!/*/}
                {/*/!*<ParagraphSidebar />*!/*/}
                {/*/!*<QuoteSidebar/>*!/*/}
                {/*/!*<VideoSidebar/>*!/*/}
            </PresentationSidebarContext.Provider>

            <Modal
                type={"other"}
                active={activeModal}
                setActive={setActiveModal}
            >
                <TypesPreview />
            </Modal>
        </>
    )
}




export default Sidebar