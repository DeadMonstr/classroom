import React, {useEffect, useRef, useState} from 'react';


import styles from "./style.module.sass";
import TextEditor from "components/ui/textEditor/TextEditor";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";





const TextEditorExc = React.memo(({ onChangeCompletedComponent, onSetCompletedComponent, component, onDeleteComponent,options,extra}) => {
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
            textComponent={component}
            onSetCompletedComponent={onSetCompletedComponent}
            onDeleteComponent={onDeleteComponent}
            extra={extra}
        />
})


const TextEditorCreate = ({textComponent,onSetCompletedComponent,onDeleteComponent,options,extra}) => {


    const {request} = useHttp()

    const onAdd = (e) => {

        let method = textComponent?.id ? "PUT" : "POST"

        request(`${BackUrl}pisa/block/text/${textComponent?.id}`,method,JSON.stringify({...textComponent,...e,...extra}),headers())
            .then(res => {
                onSetCompletedComponent(e,res.id)
            })
    }

    const onDelete = () => {


        if (textComponent?.id) {

            request(`${BackUrl}pisa/block/text/${textComponent?.id}`, "DELETE", null, headers())
                .then(res => {
                    onDeleteComponent(textComponent.id)
                })
        } else {
            onDeleteComponent(textComponent.id)
        }
    }



    return (
        <div className={styles.createText}>
            <div className={styles.subHeader}>
                <i
                    onClick={onDelete}
                    className={`fa-solid fa-trash ${styles.trash}`}
                />
            </div>
            <TextEditor
                options={options}
                text={textComponent?.text}
                editorState={textComponent.editorState}
                onSubmit={onAdd}
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
                        <div onClick={() => onChangeCompletedComponent(textComponent.id)} className={styles.popup}>
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