import React, {useEffect, useRef, useState} from 'react';


import styles from "./style.module.sass";
import TextEditor from "components/ui/textEditor/TextEditor";





const TextEditorExc = React.memo(({ onChangeCompletedComponent, onSetCompletedComponent, component, onDeleteComponent,options}) => {
    const [textComponent, setTextComponent] = useState({})

    useEffect(() => {
        setTextComponent(component)
    }, [component])



    return component.completed ?
        <TextEditorView
            textComponent={textComponent}
            setTextComponent={setTextComponent}
            onChangeCompletedComponent={onChangeCompletedComponent}
        /> :
        <TextEditorCreate
            options={options}
            textComponent={textComponent}
            onSetCompletedComponent={onSetCompletedComponent}
            onDeleteComponent={onDeleteComponent}
        />
})


const TextEditorCreate = ({textComponent,onSetCompletedComponent,onDeleteComponent,options}) => {
    return (
        <div className={styles.createText}>
            <div className={styles.subHeader}>
                <i
                    onClick={() => onDeleteComponent(textComponent.index)}
                    className={`fa-solid fa-trash ${styles.trash}`}
                />
            </div>
            <TextEditor
                options={options}
                text={textComponent?.text}
                editorState={textComponent.editorState}
                onSubmit={onSetCompletedComponent}
            />
        </div>
    )
}

const TextEditorView = ({onChangeCompletedComponent, textComponent}) => {

    const ref = useRef()

    // useEffect(() => {
    //
    //     // const text  = sanitizeHtml(textComponent.text)
    //     // const parser = new DOMParser();
    //     // const document = parser.parseFromString(textComponent.text, "text/html");
    //
    //     const elems = document.querySelector(".Excinput")
    //     const inp = document.createElement("input")
    //
    //     console.log(elems)
    //
    //     if (elems) {
    //         document.replaceWith(elems,inp)
    //     }
    //
    //
    //
    // },[textComponent])


    return (
        <div className={styles.viewText}>
            <div className={styles.text}>
                {
                    onChangeCompletedComponent ?
                        <div onClick={() => onChangeCompletedComponent(textComponent.index)} className={styles.popup}>
                            <i className="fa-sharp fa-solid fa-pen-to-square"/>
                        </div> : null
                }
                <div ref={ref} dangerouslySetInnerHTML={{__html:textComponent.text}}>
                </div>
            </div>

        </div>
    )
}


export default TextEditorExc;