import React from 'react';
import styles from './style.module.sass'
import classNames from "classnames";

const Card = ({children, extraClassname, style}) => {
    return (
        <div className={classNames(styles.card,extraClassname)} style={style}>
            {children}
        </div>
    );
};

export default Card;

