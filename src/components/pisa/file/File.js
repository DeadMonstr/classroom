import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "pages/subject/level/createChapters/createLesson/style.module.sass"
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import {useDropzone} from "react-dropzone";
import {ReactComponent as FileSvg} from "assets/icons/file-regular.svg"
import classNames from "classnames";
import {useHttp} from "hooks/http.hook";


const File = ({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent,extra}) => {
    const [fileComponent,setFileComponent] = useState({})
    useEffect(() => {
        setFileComponent(component)
    },[component])


    return component.completed ?
        <ViewFile type={type} component={fileComponent} onChangeCompletedComponent={onChangeCompletedComponent} />
        :
        <CreateFile
            extra={extra}
            component={component}
            onSetCompletedComponent={onSetCompletedComponent}
            onDeleteComponent={onDeleteComponent}
        />
};



const CreateFile = React.memo(({component,onSetCompletedComponent,onDeleteComponent,extra}) => {


    const [uploadedFiles, setUploadedFiles] = useState(null)


    useEffect(() => {
        if (component.file) {
            setUploadedFiles(component?.file)
        }
    },[])



    const {request} = useHttp()

    const onAdd = (e) => {

        const data = {
            file: uploadedFiles
        }

        const formData = new FormData()

        formData.append("file",uploadedFiles)
        formData.append("info",JSON.stringify({...component,...extra}))


        let method = component?.id ? "PUT" : "POST"

        request(`${BackUrl}pisa/block/infos/${component?.id}`,method,formData,headersImg())
            .then(res => {
                onSetCompletedComponent(data,res.id)
            })
    }

    const onDelete = () => {

        if (component?.id) {

            request(`${BackUrl}pisa/block/infos/${component?.id}`, "DELETE", null, headers())
                .then(res => {
                    onDeleteComponent(component.index)
                })
        } else {
            onDeleteComponent(component.index)
        }
    }



    const onDrop = useCallback(acceptedFiles => {
        setUploadedFiles(acceptedFiles[0]);
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div className={styles.component__create} >
            <div className={`${styles.header} ${styles.j_sp_bt}`}>
                <h1>Fayl kiriting</h1>
                <div>
                    <i
                        onClick={onDelete}
                        className={`fa-solid fa-trash ${styles.trash}`}
                    />
                </div>
            </div>

            <div className={styles.file__container}>
                <input  {...getInputProps()} />


                <div   {...getRootProps()}  className={classNames(styles.insert, {
                    [styles.focus]: isDragActive
                })}>
                    {
                        uploadedFiles ?
                            <div className={styles.wrapper}>
                                <FileSvg className={styles.icon}/>
                                <h1>{uploadedFiles.name}</h1>
                            </div>
                            :
                            <h1>Faylni yuklang</h1>
                    }
                </div>
            </div>

            <div
                onClick={onAdd}
                className={styles.submitBtn}
            >
                Tasdiqlash
            </div>

        </div>
    )
})

const ViewFile = ({component,onChangeCompletedComponent,type}) => {
    const [file,setFile] = useState(null)


    useEffect(() => {
        setFile(component?.file)
    },[component])



    return (
        <div className={styles.component__view}>
            <div className={styles.file}>
                <div className={styles.file__item}>
                    {
                        type !== "view" ?
                            <div onClick={() => onChangeCompletedComponent(component.index)} className={styles.popup}>
                                <i className="fa-sharp fa-solid fa-pen-to-square" />
                            </div> : null
                    }


                    {
                        file && <div className={styles.wrapper}>
                            <FileSvg className={styles.icon}/>
                            {file.url && type === "view" ?
                                <a download href={`${BackUrlForDoc}${file.url}`}><h1>{file?.name}</h1></a>
                                : <h1>{file?.name}</h1>
                            }

                        </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default File;