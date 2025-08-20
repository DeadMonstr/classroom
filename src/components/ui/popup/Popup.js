import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';


import cls from "./popup.module.sass"
import classNames from "classnames";
import {Link} from "react-router-dom";
import {createPortal} from "react-dom";


const setPositionModal = (popupWrapper, popupModal) => {

    const rectsWrapper = popupWrapper.getBoundingClientRect()
    const rectsModal = popupModal.getBoundingClientRect()


    // cheklovlar modalni joylashtirish uchun
    const restrictions = {
        top: 60,
        left: 300,
        right: 300,
        bottom: 0
    }

    // ekran eni va boyi
    const docX = window.innerWidth
    const docY = window.innerHeight


    // popup buttoniga yaqin tomonlar
    let nearSideX = rectsWrapper.x < docX / 2 ? "left" : "right" // agar popup "top"i ekranni enini yarmidan kicik bosa left ,kotta bosa right
    let nearSideY = rectsWrapper.y < docY / 2 ? "top" : "bottom" // agar popup "top"i ekranni boyini yarmidan kicik bosa top ,kotta bosa bottom

    // popup modalini joylashtirsa boladigan joylar
    let canPlaceX
    let canPlaceY


    // modalni joylashuvi
    // popup buttonni yaqin tomoniga qarab modal joylshtiriladi
    if (nearSideX === "left") {
        // agar chap tomondan elem (rectsWrapper.x) gacha bolgan joyga popup modal sig'sa chap, sig'masa ong
        canPlaceX = rectsModal.width + 25 < rectsWrapper.x - restrictions.left ? "left" : "right"
    } else {
        // agar ong tomondan elem (rectsWrapper.x) gacha bolgan joyga popup modal sig'sa ong, sig'masa chap
        // "docX" yozilishdan maqsad "getBoundingClientRect()" bizaga ong tomonda neca px joylashganini bermaydi
        // shuning uchun obshiy ekran enidan (docX) elementni chap tomondan qancha surilganidan (rectsWrapper.x) ayirib ong tomon kelib ciqvotti
        canPlaceX = rectsModal.width + 25 < docX - rectsWrapper.x - restrictions.right ? "right" : "left"
    }

    if (nearSideY === "top") {
        // agar tepa tomondan elem (rectsWrapper.x) gacha bolgan joyga popup modal sig'sa tepa, sig'masa pas
        canPlaceY = rectsModal.height + 25 < rectsWrapper.y - restrictions.top ? "top" : "bottom"
    } else {
        // agar pas tomondan elem (rectsWrapper.x) gacha bolgan joyga popup modal sig'sa bottom, sig'masa tepa
        // "docY" yozilishdan maqsad "getBoundingClientRect()" bizaga pas tomonda neca px joylashganini bermaydi.
        // shuning uchun obshiy ekran enidan (docX) elementni tepa tomondan qancha surilganidan (rectsWrapper.y) ayirib pas tomon kelib ciqvotti
        canPlaceY = rectsModal.height + 25 < docY - rectsWrapper.y - restrictions.bottom ? "bottom" : "top"
    }

    /////////////////////////////////////


    // popup buttoni blam modal ni enidagi farq
    // 2 ga bolinvotkanini sababi modal buttonni ortasida joylashishi kerak yarmi tepaga yarmi pasga
    const halfDistanceElems = (rectsModal.height - rectsWrapper.height) / 2


    // popup modalli butonni ortasiga joylashtirsa boladimi yoki yoq
    let canCenter

    if (nearSideY === "top") {
        // agar button blan tepa tomonni orasiga modalli ortaga joylashtirsa boladimi yoki yoq
        canCenter = rectsWrapper.y > halfDistanceElems + restrictions.top + 25
    } else {
        // agar button blan pas tomonni orasiga modalli ortaga joylashtirsa boladimi yoki yoq
        // docY sababi tepada
        canCenter = docY - rectsWrapper.bottom > halfDistanceElems + restrictions.bottom + 25
    }


    //
    // const x = popupWrapper.current.getBoundingClientRect().right + 20
    // // const y =  popupWrapper.current.getBoundingClientRect().top - ((popupModal.current.getBoundingClientRect().height - popupWrapper.current.getBoundingClientRect().height) / 2)
    // const y =  popupWrapper.current.getBoundingClientRect().top - ((popupModal.current.getBoundingClientRect().height - popupWrapper.current.getBoundingClientRect().height) / 2)
    //
    //

    const data = {
        canPlaceY,
        canPlaceX,
        canCenter,
        nearSideX,
        nearSideY
    }


    const x = canPlaceX === "left" ? rectsWrapper.left - rectsModal.width - 15 : rectsWrapper.right + 15


    const y =
        nearSideY === "top" && !canCenter ? restrictions.top + 25 : // tepadan 25 px pasda yoylashtiradi
        nearSideY === "top" && canCenter ? rectsWrapper.top - halfDistanceElems : // ortada
        nearSideY === "bottom" && !canCenter ? (docY - 25) - rectsModal.height : // pasdan 25 px tepada yoylashtiradi
        nearSideY === "bottom" && canCenter ? rectsWrapper.top - halfDistanceElems : // ortada
                        0


    const arrowX = nearSideX === "left" ? -8 : rectsModal.width - 1 // arrowni x oqi
    const arrowSide = nearSideX



    const arrowY =
        nearSideY === "top" && !canCenter ? (rectsWrapper.top - y - 5) + rectsWrapper.height / 2 :
        nearSideY === "top" && canCenter ? halfDistanceElems + (rectsWrapper.height / 2) - 8 :
        nearSideY === "bottom" && !canCenter ? (rectsWrapper.bottom - y - 5) - rectsWrapper.height / 2 :
        nearSideY === "bottom" && canCenter ? halfDistanceElems + (rectsWrapper.height / 2) - 8 :
                        0

    return {
        x, y, halfDistanceElems, arrowX, arrowY, arrowSide
    }


}


const Popup = ({children, position, trigger, childrenType = "options", options = [],styles}) => {

    const [active, setActive] = useState(false)
    const popupWrapper = useRef()
    const popupModal = useRef()
    const arrow = useRef()


    useEffect(() => {
        const toggleActiveFalse = (e) => {
            if (!popupModal.current.contains(e.target)) {
                setActive(false)
                document.body.style.pointerEvents = "auto"
            }
        }
        if (active) {
            document.addEventListener("click", toggleActiveFalse, true)
            return () => {
                document.removeEventListener("click", toggleActiveFalse, true)
            }
        }

    }, [active, popupModal])




    const renderOptions = useCallback(() => {
        if (!options.length) return

        return options.map(item => {
            if (item.type === "link") {
                return (
                    <Link to={item.to} className={cls.item}>
                        {item.children}
                    </Link>
                )
            } else {

                const onClickItem = () => {

                    setActive(false)
                    document.body.style.pointerEvents = "auto"
                    item.onClick()
                }




                return (
                    <div onClick={onClickItem} className={cls.item}>
                        {item.children}
                    </div>
                )
            }
        })
    }, [options])

    useLayoutEffect(() => {
        if (active) {
            const res = setPositionModal(popupWrapper.current, popupModal.current)
            document.body.style.pointerEvents = "none"


            popupModal.current.style.transform = `translate(${res.x}px,${res.y}px)`
            arrow.current.style.top = res.arrowY + "px"
            arrow.current.style.left = res.arrowX + "px"
            arrow.current.classList.add(cls[res.arrowSide])
        }
    }, [active])

    const onClickTrigger = (e) => {
        setActive(true)

        // console.log(popupWrapper.current.getBoundingClientRect())
        // console.log(popupWrapper.current)

    }

    return (
        <div

            className={cls.popup}
            ref={popupWrapper}
        >
            {active ? createPortal(
                <div
                    style={{
                        width: styles?.optionsWidth,
                        height: styles?.optionsHeight
                    }}
                    ref={popupModal}
                    className={classNames(cls.popup__modal, {
                        [cls.options]: childrenType === "options",
                        [cls.active]: active
                    })}
                >
                    <div className={cls.arrow} ref={arrow}></div>
                        {
                            childrenType === "options" ? renderOptions() : children
                        }
                    </div>
                , document.body
            ) : null}


            <div className={cls.popup__trigger} onClick={onClickTrigger}>
                {trigger}
            </div>
        </div>
    );
};


export default Popup;