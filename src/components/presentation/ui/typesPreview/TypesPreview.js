import React, {useState} from 'react';

import cls from "./typesPreview.module.sass"
import {contentTypes} from "components/presentation/types/content";
import {execTypes} from "components/presentation/types/exercise";
import {useDispatch} from "react-redux";
import {setSlideType} from "slices/presentationSlice";

const types = [
    {
        title: "Content types",
        name: 'content',
        items: contentTypes
    },
    {
        title: "Exercises",
        name: 'exc',
        items: execTypes
    },
]


const TypesPreview = ({active,setActive,type}) => {

    const [preview,setPreview] = useState()



    const onHover = (itemName,typeName) => {
        setPreview(types.filter(type => type.name === typeName)[0].items.filter(item => item.name === itemName)[0])
    }



    const onLeave = () => {
        setPreview({})
    }


    const dispatch = useDispatch()

    const onClick = (itemName,typeName) => {
        dispatch(setSlideType(itemName))
        setActive(false)
    }


    const Preview = preview?.preview


    return (
        <div className={cls.typesPreview}>
            <div className={cls.preview}>
                {Preview ? <Preview/> : null}
            </div>
            <div className={cls.types}>
                {
                    types.map(type => {
                        return (
                            <div className={cls.types__wrapper}>
                                <h1>{type.title}</h1>


                                <div className={cls.items}>
                                    {
                                        type.items.map(item => {
                                            const Icon = item.icon
                                            return (
                                                <div
                                                    onMouseEnter={ () => onHover(item.name,type.name)}
                                                    onMouseLeave={onLeave}
                                                    onClick={() => onClick(item.name,type.name)}
                                                    className={cls.items__item}
                                                >
                                                    <div className={cls.box}>
                                                        {item.icon && <Icon/>}
                                                    </div>
                                                    <h2>{item.title}</h2>
                                                </div>
                                            )
                                        })
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