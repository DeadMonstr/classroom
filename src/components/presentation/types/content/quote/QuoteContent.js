import React from 'react';
import ActiveBox from "components/presentation/ui/activeBox/activeBox";
import {activeTypesSideBar} from "components/presentation/types/index";
import cls from "./quoteType.module.sass"


import {quoteType} from "./quoteType"
import {makeIconComponent} from "helpers/makeIconComponent";
import {useSelector} from "react-redux";
import TextSlide from "components/presentation/ui/text/TextSlide";



export const QuoteContent = () => {
    const {currentSlide} = useSelector(state => state.presentation)

    const {heading,subheading} = currentSlide

    return (
        <ActiveBox type={activeTypesSideBar.quote}>
            <div className={cls.quote}>
                <div className={cls.quote__title}>
                    <TextSlide  type={"normal"}>
                        {subheading}
                    </TextSlide>

                </div>

                <div className={cls.quote__who}>
                    <TextSlide  type={"smaller"}>
                        {heading}
                    </TextSlide>
                </div>

                {makeIconComponent(quoteType.icon,  {className: cls.quote__icon  })}

            </div>


        </ActiveBox>
    );
};

