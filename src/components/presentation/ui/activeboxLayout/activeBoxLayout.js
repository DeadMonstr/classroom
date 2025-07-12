import React, {useEffect, useRef, useState} from 'react';




import cls from "components/presentation/ui/activeboxLayout/activeBoxLayout.module.sass"
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {setActiveType} from "slices/presentationSlice";
import {activeTypesSideBar} from "components/presentation/types";


const ActiveBoxLayout = ({type,children,clazz}) => {

    const {currentSlide} = useSelector(state => state.presentation)

    const dispatch = useDispatch()
    const [hovered, setHovered] = useState(false);




    const onClickLayout = (e) => {
        e.stopPropagation();

        dispatch(setActiveType(type))
    }


    return (
        <div
            onClick={onClickLayout}
            onMouseEnter={() => setHovered(true)}
            // onMouseLeave={() => }
            className={classNames(cls.activeBox, ...(clazz || []),{
                [`${cls.active}`]: currentSlide.activeType === type,
                [`${cls.hover}`]: hovered,
            })}
        >
            {children}
        </div>
    );
};

export default ActiveBoxLayout;