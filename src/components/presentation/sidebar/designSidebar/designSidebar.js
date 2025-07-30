import React, {useCallback, useEffect, useMemo, useState} from "react";
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

import {useDispatch, useSelector} from "react-redux";
import {
    clearExtraOptions,
    setDesignHorizontalAlign,
    setDesignVerticalAlign,
    setDesignLayoutOption,
    setDesignLayoutSize,
    setDesignFontSize,
    setDesignFontColor,
    setDesignBackgroundColor, setSlideImageType,
} from "slices/presentationSlice";
import Radio from "components/ui/form/radio";

const MAX_SIZE = 4;
const MIN_SIZE = 0;

const optionsLayout = [
    {
        type: "default",
        content: <Default/>,
    },
    {
        type: "background",
        content: <Background/>,
        extraOptions: {
            fontColor: '#ffffff',
        }
    },
    {type: "left", content: <Left/>},
    {type: "right", content: <Right/>},
    {type: "fullLeft", content: <FullLeft/>},
    {type: "fullRight", content: <FullRight/>},
    {type: "top", content: <Top/>},
    {type: "bottom", content: <Bottom/>},
];

const optionsHorizontal = [
    {type: "left", content: <HrLeft/>},
    {type: "center", content: <HrCenter/>},
    {type: "right", content: <HrRight/>},
];

const optionsVertical = [
    {type: "top", content: <VrTop/>},
    {type: "center", content: <VrCenter/>},
    {type: "bottom", content: <VrBottom/>},
];

const optionsImageTypes = [
    {title: "Center", value: "center"},
    {title: "Full screen",value: "full"}
];


const DesignSidebar = () => {
    const dispatch = useDispatch();
    const {currentSlide} = useSelector((state) => state.presentation);
    const [color, setColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");

    useEffect(() => {
        setColor(currentSlide.design.fontColor);
    }, [currentSlide.design.fontColor]);

    useEffect(() => {
        setBackgroundColor(currentSlide.design.backgroundColor);
    }, [currentSlide.design.backgroundColor]);

    const handleHover = useCallback((optionType, value , extra) => {
        if (optionType === "horizontal" || optionType === "vertical") {
            handleAlign(optionType, value, "extra");
        } else if (optionType === "layout") {
            handleLayout(value, extra,"extra");
        }
    }, []);

    const handleLeave = useCallback((optionType) => {
        dispatch(clearExtraOptions(optionType));
    }, [dispatch]);

    const handleAlign = useCallback((axis, value, target = "current") => {
        const action = axis === "horizontal" ? setDesignHorizontalAlign : setDesignVerticalAlign;
        dispatch(action({type: target, align: value}));
    }, [dispatch]);

    const handleLayout = useCallback((layout ,extra, target = "current") => {
        dispatch(setDesignLayoutOption({type: target, layout, extra}));
    }, [dispatch]);

    const handleSizeChange = useCallback((field, type) => {
        const action = field === "layout" ? setDesignLayoutSize : setDesignFontSize;
        const delta = type === "inc" ? 1 : -1;
        dispatch(action(delta));
    }, [dispatch]);

    const handleColorChange = useCallback((color) => {
        dispatch(setDesignFontColor(color));
    }, [dispatch]);

    const handleBackgroundChange = useCallback((color) => {
        dispatch(setDesignBackgroundColor(color));
    }, [dispatch]);

    const handelChangeImageType = useCallback((type) => {
        dispatch(setSlideImageType(type))
    },[])

    const renderControlButtons = (value, onInc, onDec) => (
        <div className={cls.controller}>
            <div
                className={classNames(cls.item, {[cls.disabled]: value === MIN_SIZE})}
                onClick={() => value > MIN_SIZE && onDec()}
            >
                <i className="fa-solid fa-minus"></i>
            </div>
            <div
                className={classNames(cls.item, {[cls.disabled]: value === MAX_SIZE})}
                onClick={() => value < MAX_SIZE && onInc()}
            >
                <i className="fa-solid fa-plus"></i>
            </div>
        </div>
    );

    const renderOptionIcons = (options, currentValue, type) => (
        <div className={cls.icons}>
            {options.map((item) => (
                <HoverElem
                    key={item.type}
                    onClick={() => handleAlign(type, item.type)}
                    onEnter={() => handleHover(type, item.type)}
                    onLeave={() => handleLeave(type)}
                >
                    <div className={classNames(cls.icon, {[cls.active]: currentValue === item.type})}>
                        {item.content}
                    </div>
                </HoverElem>
            ))}
        </div>
    );


    const renderOptionImageTypes = useCallback(() => (
        <div className={cls.imageTypes}>
            {optionsImageTypes.map((item) => (
                <Radio checked={currentSlide.imageType === item.value} onChange={ () => handelChangeImageType(item.value)}>{item.title}</Radio>
            ))}
        </div>
    ),[handelChangeImageType, optionsImageTypes,currentSlide.imageType ])

    return (
        <div className={cls.design}>
            {currentSlide.design.isLayout && (
                <div className={cls.layout}>
                    <h2 className={cls.titleComponent}>Layout</h2>
                    <div className={cls.layout__wrapper}>
                        {optionsLayout.map((item) => (
                            <HoverElem
                                key={item.type}
                                onClick={() => handleLayout(item.type, item.extraOptions)}
                                onEnter={() => handleHover("layout", item.type,item.extraOptions)}
                                onLeave={() => handleLeave("layout")}
                            >
                                <div className={classNames(cls.item, {
                                    [cls.active]: currentSlide.design.layout === item.type,
                                })}>
                                    {item.content}
                                </div>
                            </HoverElem>
                        ))}
                    </div>
                    {currentSlide.design.isLayoutSize && (
                        <div className={cls.component}>
                            <h2 className={cls.subTitleComponent}>Image size</h2>
                            {renderControlButtons(currentSlide.design.layoutSize, () => handleSizeChange("layout", "inc"), () => handleSizeChange("layout", "dec"))}
                        </div>
                    )}
                    <div className={cls.separator}/>
                </div>
            )}

            {currentSlide.slideType === "image" &&
                <div className={classNames(cls.component,cls.fdc)}>
                    <h2 className={cls.subTitleComponent}>Image type</h2>
                    {renderOptionImageTypes()}
                </div>
            }


            <div className={cls.titleComponent}>Text</div>
            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Text color</h2>
                <ColorPopup color={color} setColor={handleColorChange}/>
            </div>

            {currentSlide.design.isHorizontalAlign && (
                <div className={cls.component}>
                    <h2 className={cls.subTitleComponent}>Horizontal alignment</h2>
                    {renderOptionIcons(optionsHorizontal, currentSlide.design.horizontalAlign, "horizontal")}
                </div>
            )}

            {currentSlide.design.isVerticalAlign && (
                <div className={cls.component}>
                    <h2 className={cls.subTitleComponent}>Vertical alignment</h2>
                    {renderOptionIcons(optionsVertical, currentSlide.design.verticalAlign, "vertical")}
                </div>
            )}

            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Text Size</h2>
                {renderControlButtons(currentSlide.design.fontSize, () => handleSizeChange("font", "inc"), () => handleSizeChange("font", "dec"))}
            </div>

            <div className={cls.separator}/>

            <h2 className={cls.titleComponent}>Background</h2>
            <div className={cls.component}>
                <h2 className={cls.subTitleComponent}>Background color</h2>
                <ColorPopup color={backgroundColor} setColor={handleBackgroundChange}/>
            </div>
        </div>
    );
};

const HoverElem = React.memo(({children, onEnter, onLeave, onClick}) => (
    <div onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {children}
    </div>
));

export default DesignSidebar;
