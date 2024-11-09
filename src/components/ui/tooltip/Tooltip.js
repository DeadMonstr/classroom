import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';


import cls from "components/ui/tooltip/tooltip.module.sass"
import classNames from "classnames";
import {Link} from "react-router-dom";
import {createPortal} from "react-dom";


const setPositionModal = (popupWrapper, popupModal) => {

    const rectsWrapper = popupWrapper.getBoundingClientRect()
    const rectsModal = popupModal.getBoundingClientRect()



    // ekran eni va boyi
    const docX = window.innerWidth
    const docY = window.innerHeight

    // popup modalini joylashtirsa boladigan joylar
    let canPlaceY
    let canPlaceX
    let canCenter



    canPlaceY = docY - rectsWrapper.bottom > rectsModal.height ? "bottom" : "top"
    canPlaceX = rectsWrapper.left > rectsModal.width ? "left" : "right"

    canCenter = rectsWrapper.left + (rectsWrapper.width / 2) - (rectsModal.width / 2) > 20


    // const x = rectsWrapper.left + (rectsWrapper.width / 2) - (rectsModal.width / 2)
    const x =
        canPlaceX === "left" && canCenter ? rectsWrapper.left + (rectsWrapper.width / 2) - (rectsModal.width / 2):
        canPlaceX === "left" && !canCenter ? 20 :
        canPlaceX === "right" && canCenter ? rectsWrapper.left + (rectsWrapper.width / 2) - (rectsModal.width / 2):
        canPlaceX === "right" && !canCenter ? 20 :
            null




    const y =
        canPlaceY === "top" ? rectsWrapper.top - rectsWrapper.height * 2:
        canPlaceY === "bottom" ? rectsWrapper.bottom + 10:
            null


    return {
        x, y
    }
}


const Tooltip = ({children,extraClass}) => {

    const [active, setActive] = useState(false)
    const popupWrapper = useRef()
    const popupModal = useRef()
    const arrow = useRef()






    useLayoutEffect(() => {

        if (active) {
            const res = setPositionModal(popupWrapper.current, popupModal.current)
            popupModal.current.style.transform = `translate(${res.x}px,${res.y}px)`
        }
    }, [active])


    const onHover = () => {
       setActive(true)
    }

    const onLeave = () => {
        setActive(false)
    }

    return (
        <div className={cls.tooltip} ref={popupWrapper}>
            {active ? createPortal(
                <div
                    ref={popupModal}
                    className={classNames(cls.tooltip__modal, {
                        [cls.active]: active
                    })}
                >
                    {children}
                </div>
                , document.body
            ) : null}


            <h1
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                className={extraClass}
            >
                {children}
            </h1>


        </div>
    );
};


export default Tooltip;