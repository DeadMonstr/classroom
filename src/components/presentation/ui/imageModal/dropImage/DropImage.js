import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDropzone} from "react-dropzone";
import {useHttp} from "hooks/http.hook";
import cls from "components/presentation/ui/imageModal/dropImage/dropImage.module.sass";

import {ReactComponent as ImgThumb} from "assets/icons/imageThumb.svg"


const acceptStyle = {
    borderColor: '#00e676'
};


const DropImage = ({setImage}) => {



    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        setImage(acceptedFiles[0])
    }, [])

    const {getRootProps, getInputProps, isFocused, isDragAccept} = useDropzone({onDrop})

    const style = useMemo(() => ({
        ...(isDragAccept ? acceptStyle : {})
    }), [
        isFocused,
        isDragAccept
    ]);





    return (
        <div className={cls.dropImage} {...getRootProps({style})} >
            <input {...getInputProps()} />

            <ImgThumb/>

            <h2>Drop img or click to upload img</h2>
            <h3>Max size to upload 13mb</h3>
            <h3>.png,.jpg,.svg,.gif</h3>
        </div>
    )
}


export default DropImage