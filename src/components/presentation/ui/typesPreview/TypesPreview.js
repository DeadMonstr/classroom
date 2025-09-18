import React, {useState} from 'react';

import cls from "./typesPreview.module.sass"
import {contentTypes} from "components/presentation/types/content";
import {execTypes} from "components/presentation/types/exercise";
import {useDispatch} from "react-redux";
import {
    onAddPresentationSlide,
    onAddSlide,
    onChangeSlideType,
    onEditPresentationSlide,
    setSlideType
} from "slices/presentationSlice";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";

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


    const {id} = useParams()




    const onHover = (itemName,typeName) => {
        setPreview(types.filter(type => type.name === typeName)[0].items.filter(item => item.name === itemName)[0])
    }



    const onLeave = () => {
        setPreview({})
    }


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClick = (itemName,typeName) => {
        dispatch(setSlideType(itemName))
        // if (type === "add") {
        //
        //     dispatch(onAddPresentationSlide({slideType: itemName, slide_id: id}))
        //         .then(res => {
        //             dispatch(onAddSlide(res.payload))
        //             navigate(`?slide_item=${res.payload.id}`)
        //         })
        //     setActive(false)
        // } else {
        //     dispatch(onEditPresentationSlide({slideType: itemName, slide_id: id}))
        //         .then(res => {
        //             dispatch(onChangeSlideType(res.payload))
        //         })
        //     setActive(false)
        // }
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