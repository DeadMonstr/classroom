import React, {useEffect, useState} from 'react';


import cls from "./variantsSlide.module.sass"
import {multipleChoiceType} from "components/presentation/types/exercise/multipleChoice";
import Button from "components/ui/button";
import Checkbox from "components/ui/form/checkbox";
import Input from "components/ui/form/input";
import ColorPopup from "components/ui/colorPopup/colorPopup";


const VariantsSlide = ({variants, onAdd, onChange, onDelete, haveCorrect}) => {


    const renderVariants = () => {
        if (!variants.length) return;


        return variants.map((item,index) => {
            return <Variant
                item={item}
                haveCorrect={haveCorrect}
                onChange={onChange}
                onDelete={onDelete}
                canDelete={index !== 0}
            />
        })


    }


    return (
        <div className={cls.variants}>

            <h1>Variants</h1>
            <div className={cls.variants__wrapper}>
                {renderVariants()}
            </div>


            <Button
                type={"present"}
                extraClass={cls.addBtn}
                onClick={onAdd}
                disabled={variants.length >= 10}
            >
                {/*{makeIconComponent(multipleChoiceType.icon)}*/}

                Add variant
            </Button>


        </div>
    );
};


const Variant = ({item, onChange, onDelete, haveCorrect,canDelete}) => {


    const [name, setName] = useState(item.name)
    const [correct, setCorrect] = useState(item.correct)
    const [color, setColor] = useState(item.color)

    useEffect(() => {
        setCorrect(item.correct)
    },[item.correct])



    useEffect(() => {
        onChange({...item, name, correct,color})
    }, [name, correct,color])


    return (
        <div className={cls.variants__item}>
            {
                haveCorrect && <Checkbox
                    value={correct}
                    onChange={setCorrect}
                    checked={correct}
                    cls={[cls.checkbox]}
                />
            }

            <Input
                value={name}
                onChange={setName}
                extraClassNameLabel={cls.input}
            />
            <ColorPopup color={color} setColor={setColor}/>
            {
                canDelete && <i onClick={() => onDelete(item.id)} className="fa-solid fa-xmark"></i>
            }


        </div>

    )
}


export default VariantsSlide;