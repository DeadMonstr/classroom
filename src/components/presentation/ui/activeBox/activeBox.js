import React, { useCallback, useEffect, useState, useContext, createContext, useMemo } from 'react';
import cls from "./activeBox.module.sass";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { setActiveType } from "slices/presentationSlice";

// Create a context for managing ActiveBox parent-child relationships
const ActiveBoxContext = createContext(null);

const ActiveBox = ({
                       type,
                       children,
                       clazz,
                       isParent = false
                   }) => {
    const { currentSlide } = useSelector(state => state.presentation);
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [childIsHovered, setChildIsHovered] = useState(false);

    // Get parent context if it exists
    const parentContext = useContext(ActiveBoxContext);

    const handleChildHover = useCallback((hovered) => {
        setChildIsHovered(hovered);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    // Notify parent when this child is hovered (throttled)
    useEffect(() => {
        if (parentContext?.onChildHover) {
            parentContext.onChildHover(isHovered);
        }
    }, [isHovered, parentContext]);

    // Parent shows hover only when not hovering over children
    const shouldShowHover = isParent ? (isHovered && !childIsHovered) : isHovered;

    const handleClick = useCallback((e) => {
        e.stopPropagation();

        if (type) {
            dispatch(setActiveType(type));
        }
    }, [dispatch, type]);

    // Memoize classes to prevent unnecessary recalculations
    const boxClasses = useMemo(() => classNames(
        cls.activeBox,
        ...(clazz || []),
        {
            [`${cls.active}`]: currentSlide.activeType === type,
            [`${cls.hover}`]: shouldShowHover,
        }
    ), [clazz, currentSlide.activeType, type, shouldShowHover]);

    // Memoize styles to prevent unnecessary recalculations
    // const boxStyles = useMemo(() => ({
    //     padding: '10px',
    //     margin: '5px',
    //     backgroundColor: shouldShowHover ? '#e3f2fd' : 'transparent',
    //     border: `2px solid ${shouldShowHover ? '#2196f3' : 'transparent'}`,
    //     borderRadius: '4px',
    //     cursor: 'pointer',
    //     transition: 'all 0.2s ease',
    // }), [shouldShowHover]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() =>
            isParent ? {
                onChildHover: handleChildHover,
                isParent: true
            } : null
        , [isParent, handleChildHover]);

    const content = (
        <div
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={boxClasses}
            data-type={type}
            // style={boxStyles}
        >
            {children}
        </div>
    );

    // If this is a parent, provide context to children
    if (isParent) {
        return (
            <ActiveBoxContext.Provider value={contextValue}>
                {content}
            </ActiveBoxContext.Provider>
        );
    }

    return content;
};

export default ActiveBox;