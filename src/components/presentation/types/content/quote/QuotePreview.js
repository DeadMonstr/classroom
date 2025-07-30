
import cls from "components/presentation/types/content/quote/quoteType.module.sass";
import {makeIconComponent} from "helpers/makeIconComponent";
import {quoteType} from "components/presentation/types/content/quote/quoteType";
import React from "react";


export const QuotePreview = () => {



    return (

        <div className={cls.quote}>
            <div className={cls.quote__title}>
                Хочешь быть великим, нужно идти на жертвы. И чем мучительнее жертва, тем твое величие больше
            </div>

            <div className={cls.quote__who}>
                O'zbek xalq iqtiboslari
            </div>



            {makeIconComponent(quoteType.icon,  {className: cls.quote__icon  })}

        </div>



    );
};

