import React, {useCallback, useEffect, useState} from "react";
import cls from "./designSidebar.module.sass";
import classNames from "classnames";


import {ReactComponent as Default} from "assets/icons/Default.svg"
import {ReactComponent as Left} from "assets/icons/Left img.svg"
import {ReactComponent as Right} from "assets/icons/Right img.svg"
import {ReactComponent as FullLeft} from "assets/icons/Full left img.svg"
import {ReactComponent as FullRight} from "assets/icons/Full right img.svg"
import {ReactComponent as Background} from "assets/icons/Background image.svg"
import {ReactComponent as Top} from "assets/icons/Top img.svg"
import {ReactComponent as Bottom} from "assets/icons/Bottom img.svg"


import {ReactComponent as HrLeft} from "assets/icons/horizontal-left.svg"
import {ReactComponent as HrCenter} from "assets/icons/horizontal-center.svg"
import {ReactComponent as HrRight} from "assets/icons/horizontal-right.svg"
import {ReactComponent as VrTop} from "assets/icons/vetical-top.svg"
import {ReactComponent as VrCenter} from "assets/icons/vertical-center.svg"
import {ReactComponent as VrBottom} from "assets/icons/vertical-bottom.svg"


import Popup from "components/ui/popup/Popup";
import Button from "components/ui/button";
import ColorPopup from "components/ui/colorPopup/colorPopup";


import {typesPresentation} from "components/presentation/types";
import {useDispatch, useSelector} from "react-redux";
import {
    clearExtraOptions,
    setDesignHorizontalAlign,
    setDesignVerticalAlign,
    setDesignLayoutOption, setDesignLayoutSize, setDesignFontSize, setDesignFontColor, setDesignBackgroundColor
} from "slices/presentationSlice";
import {useExamSecurity} from "hooks/useExamSecurity";


const typeDesign = [
    "Slide", "Theme"
]


const optionsLayout = [
    {
        type: "default",
        content: <Default/>
    },
    {
        type: "background",
        content: <Background/>
    },
    {
        type: "left",
        content: <Left/>
    },
    {
        type: "right",
        content: <Right/>
    },
    {
        type: "fullLeft",
        content: <FullLeft/>
    },
    {
        type: "fullRight",
        content: <FullRight/>
    },
    {
        type: "top",
        content: <Top/>
    },
    {
        type: "bottom",
        content: <Bottom/>
    }
]


const optionsHorizontal = [
    {
        type: "left",
        content: <HrLeft/>
    },
    {
        type: "center",
        content: <HrCenter/>
    },
    {
        type: "right",
        content: <HrRight/>
    }
]


const optionsVertical = [
    {
        type: "top",
        content: <VrTop/>
    },
    {
        type: "center",
        content: <VrCenter/>
    },
    {
        type: "bottom",
        content: <VrBottom/>
    }
]


const DesignSidebar = () => {
    const {currentSlide} = useSelector(state => state.presentation)


    const [type, setType] = useState("Slide")
    const [color, setColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");



    useEffect(() => {
        setColor(currentSlide.design.fontColor)
    },[currentSlide.design.fontColor])

    useEffect(() => {
        setBackgroundColor(currentSlide.design.backgroundColor)
    },[currentSlide.design.backgroundColor])



    const dispatch = useDispatch()


    const onHover = useCallback((typeOption, type) => {
        if (typeOption === "horizontal" || typeOption === "vertical") {
            onChangeAlign(typeOption, type, "extra")
        } else if (typeOption === "layout") {
            onChangeLayoutOption(type,"extra")
        }
    },[])

    const onLeave = useCallback((typeOption) => {
        dispatch(clearExtraOptions(typeOption))
    },[])


    const onChangeAlign = useCallback((typeAlign, type, typePlace = "current") => {
        if (typeAlign === "horizontal") {
            dispatch(setDesignHorizontalAlign({type: typePlace, align: type}))
        } else {
            dispatch(setDesignVerticalAlign({type: typePlace, align: type}))
        }
    },[])

    const onChangeLayoutOption = useCallback((layout, typePlace = "current") => {
        dispatch(setDesignLayoutOption({type: typePlace, layout}))
    },[])


    const onChangeLayoutSize = useCallback((type) => {
        if (type === "inc" ) {
            dispatch(setDesignLayoutSize(1))
        } else {
            dispatch(setDesignLayoutSize(-1))
        }
    },[])

    const onChangeFontSize = useCallback((type) => {
        if (type === "inc" ) {
            dispatch(setDesignFontSize(1))
        } else {
            dispatch(setDesignFontSize(-1))
        }
    },[])


    const onChangeFontColor = (e) => {
        dispatch(setDesignFontColor(e))
        // setColor(e)
    }


    const onChangeBackgroundColor = (e) => {
        dispatch(setDesignBackgroundColor(e))
    }


    // useExamSecurity();
    //
    // useEffect(() => {
    //     const enterFullscreen = () => {
    //         const el = document.documentElement;
    //         if (el.requestFullscreen) {
    //             el.requestFullscreen().catch((err) => {
    //                 console.error("Fullscreen error:", err);
    //             });
    //         }
    //     };
    //
    //     enterFullscreen();
    // }, []);

    // 12214


    return (
        <div className={cls.design}>
                {/*<div className={cls.designType}>*/}
                {/*    {*/}
                {/*        typeDesign.map(item => {*/}
                {/*            return (*/}
                {/*                <div*/}
                {/*                    className={classNames(cls.designType__item, {*/}
                {/*                        [cls.active]: type === item*/}
                {/*                    })}*/}
                {/*                    onClick={() => setType(item)}*/}
                {/*                >*/}
                {/*                    {item}*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*</div>*/}

            {
                currentSlide.design.isLayout &&
                <div className={cls.layout}>
                    <h2 className={cls.titleComponent}>Layout</h2>

                    <div className={cls.layout__wrapper}>
                        {
                            optionsLayout.map(item => {
                                return (
                                    <HoverElem
                                        onClick={() => onChangeLayoutOption(item.type)}
                                        onEnter={() => onHover("layout", item.type)}
                                        onLeave={() => onLeave("layout")}
                                    >
                                        <div
                                            className={classNames(cls.item, {
                                                [cls.active]: currentSlide.design.layout === item.type
                                            })}
                                        >
                                            {item.content}
                                        </div>
                                    </HoverElem>

                                )
                            })
                        }
                    </div>
                    { currentSlide.design.isLayoutSize ?
                        <div className={cls.component}>
                            <h2 className={cls.subTitleComponent}>Image size</h2>
                            <div>
                                <div className={cls.controller}>
                                    <div
                                        className={classNames(cls.item, {
                                            [cls.disabled]: currentSlide.design.layoutSize === 0
                                        })}
                                        onClick={() => {
                                            if (currentSlide.design.layoutSize !== 0) onChangeLayoutSize("dec")
                                        }}
                                    >
                                        <i className="fa-solid fa-minus"></i>
                                    </div>
                                    <div
                                        className={classNames(cls.item, {
                                            [cls.disabled]: currentSlide.design.layoutSize === 4
                                        })}
                                        onClick={() => {
                                            if (currentSlide.design.layoutSize !== 4) onChangeLayoutSize("inc")
                                        }}
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div> :null
                    }
                    <div className={cls.separator}/>
                </div>
            }


            <div className={cls.titleComponent}>
                Text
            </div>

            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Text color</h2>
                <div>
                    <ColorPopup color={color} setColor={onChangeFontColor}/>
                </div>
            </div>


            {
                currentSlide.design.isHorizontalAlign &&
                <div className={cls.component}>
                    <h2 className={cls.subTitleComponent}>Horizontal alignment</h2>
                    <div>
                        <div className={cls.icons}>
                            {
                                optionsHorizontal.map(item => {
                                    return (
                                        <HoverElem
                                            onClick={() => onChangeAlign("horizontal", item.type)}
                                            onEnter={() => onHover("horizontal", item.type)}
                                            onLeave={() => onLeave("horizontal")}
                                        >
                                            <div
                                                className={classNames(cls.icon, {
                                                    [cls.active]: currentSlide.design.horizontalAlign === item.type
                                                })}
                                            >
                                                {item.content}
                                            </div>
                                        </HoverElem>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            {
                currentSlide.design.isVerticalAlign &&
                <div className={cls.component}>
                    <h2 className={cls.subTitleComponent}>Vertical alignment</h2>
                    <div>
                        <div className={cls.icons}>
                            {
                                optionsVertical.map(item => {
                                    return (
                                        <HoverElem
                                            onClick={() => onChangeAlign("vertical", item.type)}
                                            onEnter={() => onHover("vertical", item.type)}
                                            onLeave={() => onLeave("vertical")}
                                        >
                                            <div
                                                className={classNames(cls.icon, {
                                                    [cls.active]: currentSlide.design.verticalAlign === item.type
                                                })}
                                            >
                                                {item.content}
                                            </div>
                                        </HoverElem>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }

            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Text Size</h2>
                <div>
                    <div className={cls.controller}>
                        <div
                            className={classNames(cls.item, {
                                [cls.disabled]: currentSlide.design.fontSize === 0
                            })}
                            onClick={() => {
                                if (currentSlide.design.fontSize !== 0) onChangeFontSize("dec")
                            }}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </div>
                        <div
                            className={classNames(cls.item, {
                                [cls.disabled]: currentSlide.design.fontSize === 4
                            })}
                            onClick={() => {
                                if (currentSlide.design.fontSize !== 4) onChangeFontSize("inc")
                            }}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>

            </div>


            <div className={cls.separator}/>

            <h2 className={cls.titleComponent}>Background</h2>
            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Background color</h2>

                <div>
                    <ColorPopup color={backgroundColor} setColor={onChangeBackgroundColor}/>
                    {/*<ColorPicker color={color} onChange={setColor}  />;*/}
                </div>
            </div>


        </div>
    )
}





const HoverElem = React.memo(({children, onEnter, onLeave, onClick}) => {

        return (
            <div
                onClick={onClick}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
            >
                {children}
            </div>
        )
    }
)

export default DesignSidebar