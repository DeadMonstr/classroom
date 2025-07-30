import React, {useEffect, useState} from 'react';
import cls from "./content.module.sass";
import {
    activeTypesSideBar, contentTypes,
} from "components/presentation/types";
import {useDispatch, useSelector} from "react-redux";

import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import DesignSidebar from "components/presentation/sidebar/designSidebar/designSidebar";


const layoutSizeTypes = [
    {
        id: 0,
        size: "10%"
    },
    {
        id: 1,
        size: "20%"
    },
    {
        id: 2,
        size: "30%"
    },
    {
        id: 3,
        size: "40%"
    },
    {
        id: 4,
        size: "50%"
    },
]


const Content = () => {

    const {currentSlide} = useSelector(state => state.presentation)

    const [layout, setLayout] = useState("")
    const [layoutSizeWidth, setLayoutSizeWidth] = useState("")
    const [layoutSizeHeight, setLayoutSizeHeight] = useState("")
    const [image, setImage] = useState("")
    const [bgColor, setBgColor] = useState("")


    useEffect(() => {
        if (currentSlide.extraDesign.layout && currentSlide.design.layout) {
            setLayout(currentSlide.extraDesign.layout)
            setLayoutSizeHeight("")
            setLayoutSizeWidth("")
        } else {
            setLayout(currentSlide.design.layout)
        }
    }, [currentSlide.design.layout, currentSlide.extraDesign.layout])

    useEffect(() => {
        if (currentSlide.extraDesign.layout) return

        if (
            currentSlide.design.layout === "fullLeft" ||
            currentSlide.design.layout === "fullRight" ||
            currentSlide.design.layout === "top" ||
            currentSlide.design.layout === "bottom"
        ) {
            if (currentSlide.design.layout === "top" || currentSlide.design.layout === "bottom") {
                setLayoutSizeHeight(layoutSizeTypes.filter(item => item.id === currentSlide.design.layoutSize)[0].size)
                setLayoutSizeWidth("")
            } else {
                setLayoutSizeWidth(layoutSizeTypes.filter(item => item.id === currentSlide.design.layoutSize)[0].size)
                setLayoutSizeHeight("")
            }
        }
    }, [currentSlide.design.layout, currentSlide.design.layoutSize, currentSlide.extraDesign.layout])


    useEffect(() => {
        setImage(currentSlide.image)
    }, [currentSlide.image])

    useEffect(() => {
        setBgColor(currentSlide.design.backgroundColor)
    }, [currentSlide.design.backgroundColor])




    const renderContent = () => {
        return contentTypes.map(item => {


            if (item.name === currentSlide.slideType) {
                const Content = item.content

                return Content ? <Content /> : null;
            }
        })
    }




    return (
        <ActiveBox
            isParent={true}
            clazz={[cls.main, cls[layout]]}
            type={activeTypesSideBar.layout}
        >
            {
                layout !== "default" &&
                <div
                    style={{
                        minWidth: layoutSizeWidth,
                        maxWidth: layoutSizeWidth,
                        minHeight: layoutSizeHeight,
                        maxHeight: layoutSizeHeight
                    }}
                    className={cls.image}
                >
                    <img src={image} alt=""/>
                </div>
            }




            <div className={cls.content} style={{backgroundColor: currentSlide.slideType !== "image" ? bgColor : null}}>
                {/*<HeadingContent />*/}
                {/*<ParagraphContent/>*/}
                {/*<NumberContent/>*/}
                {/*<ImageContent/>*/}
                {/*<QuoteContent/>*/}
                {/*<VideoContent/>*/}

                {renderContent()}

            </div>

        </ActiveBox>
    );
};

export default Content;