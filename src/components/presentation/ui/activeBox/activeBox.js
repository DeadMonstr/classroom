import React from 'react';




import cls from "./activeBox.module.sass"
import classNames from "classnames";


const ActiveBox = ({active,type,children,clazz,onClick}) => {




    return (
        <div
            onClick={onClick}
            className={classNames(cls.activeBox, ...clazz,{
                [`${cls.active}`]: active === type,
            })}
        >
            {children}
        </div>
    );
};

export default ActiveBox;