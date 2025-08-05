import React from 'react';

import cls from "./optionSwitcherSlide.module.sass"
import {Switch} from "components/ui/switch/switch";


const OptionSwitcherSlide = ({children, title,onToggle,active}) => {
    return (
        <div className={cls.optionSwitcher}>

            <div className={cls.switch}>
                <h2>{title}</h2>
                <Switch switchOn={active} setSwitchOn={onToggle}/>
            </div>
            {
                active && children ?
                    <div className={cls.innerComponent}>
                        {children}
                    </div>
                    : null
            }



        </div>
    );
};

export default OptionSwitcherSlide;