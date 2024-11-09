import React, {useState} from 'react';

import cls from "./typesPreview.module.sass"
import {contentTypes} from "components/presentation/types/content";

const types = [
    {
        title: "Content types",
        name: 'content',
        items: contentTypes
    },
]


const TypesPreview = ({activeType}) => {


    const [preview,setPreview] = useState()



    const onHover = (itemName,typeName) => {
        setPreview(types.filter(type => type.name === typeName)[0].items.filter(item => item.name === itemName)[0])
    }



    const onLeave = () => {
        setPreview({})
    }

    return (
        <div className={cls.typesPreview}>
            <div className={cls.preview}>
                {preview?.preview}
            </div>
            <div className={cls.types}>
                {
                    types.map(type => {
                        return (

                            <div className={cls.types__wrapper}>
                                <h1>{type.title}</h1>


                                <div className={cls.items}>
                                    {
                                        type.items.map(item => ((
                                            <div
                                                onMouseEnter={ () => onHover(item.name,type.name)}
                                                onMouseLeave={onLeave}
                                                className={cls.items__item}
                                            >
                                                <div className={cls.box}>
                                                    {item.icon}
                                                </div>
                                                <h2>{item.title}</h2>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};





export default TypesPreview;