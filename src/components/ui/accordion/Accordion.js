import React, {useEffect, useRef, useState} from 'react';



import cls from "./accordion.module.sass"
import {BackUrlForDoc} from "constants/global";
import classNames from "classnames";




const Accordion = ({img,title,subtitle,children,backOpen,setBackOpen,clazz,btns}) => {


    const [open,setOpen] = useState(false)


    const contentHeight = useRef()


    const toggleOpen = (e) => {

        if (e.target.tagName !== "BUTTON") {
            if (backOpen !== undefined) {
                setBackOpen(!backOpen)
            } else {
                setOpen(!open)
            }
        }

    }



    return (
        <div
            className={classNames(cls.accordion,clazz, {
                [cls.active]: backOpen || open
            })}


        >
            <div onClick={toggleOpen} className={cls.header}>
                <div className={cls.info}>
                    {img && <img src={typeof img === "string" ? BackUrlForDoc+img : img} alt=""/>}
                    <div>
                        <h1>{title}</h1>
                        {subtitle && <h1>{subtitle}</h1>}
                    </div>
                </div>


                <div className={cls.btns}>
                    {
                        btns?.map(item => {
                            return item
                        })
                    }
                    <div className={classNames(cls.arrow, {
                        [cls.active]: backOpen || open
                    })}>
                        <i className="fas fa-sort-down"></i>
                    </div>
                </div>



            </div>
            <div
                style={
                    backOpen || open
                        ? { height: contentHeight.current.scrollHeight }
                        : { height: "0px" }
                }
                ref={contentHeight}
                className={cls.wrapper}
            >
                <div>
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Accordion;