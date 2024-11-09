import React, {useState} from 'react';

import cls from "./switch.module.sass"
import classNames from "classnames";

export const Switch = React.memo((
    {
        disabled,
        switchOn,
        setSwitchOn
    }) => {


    return (

        <button
            disabled={disabled}
            className={classNames(cls.mainSwitchBox, {
                [cls.disabled] : disabled,
                [cls.switchOn] : switchOn
            })}
            onClick={()=> setSwitchOn(!switchOn)}>
            {switchOn ?

                <span className={cls.mainSwitchBox__offSwitch}></span>
                :
                <span className={cls.mainSwitchBox__onSwitch}></span>
            }

        </button>


    );
});


