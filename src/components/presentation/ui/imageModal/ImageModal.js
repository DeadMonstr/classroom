import React, {useEffect, useState} from 'react';
import Modal from "components/ui/modal";


import cls from "components/presentation/ui/imageModal/imageModal.module.sass"

import {ReactComponent as ImgThumb} from "assets/icons/imageThumb.svg"
import classNames from "classnames";
import CropImage from "components/presentation/ui/imageModal/cropImage/CropImage";
import DropImage from "components/presentation/ui/imageModal/dropImage/DropImage";
import Gifs from "components/presentation/ui/imageModal/gifs/Gifs";
import UpdaterFile from "components/presentation/ui/updaterFile/UpdaterFile";


const types = [
    "Image", "Gifs"
]


const ImageModal = ({extraClass}) => {


    const [active, setActive] = useState(false)

    const [image, setImage] = useState(null)
    const [type, setType] = useState("img")


    useEffect(() => {
        if (image) setType("crop")
    },[image])

    return (
        <>
            <div onClick={() => setActive(true)} className={classNames(cls.imageBtn, extraClass)}>
                <ImgThumb/>

                <h2>
                    Drag and drop image or
                    Click to add
                </h2>
            </div>

            {/*<UpdaterFile/>*/}

            <Modal type={"other"} active={active} setActive={setActive}>
                <div className={cls.imageModal}>
                    { type === "crop" ? <CropImage setType={setType} image={image}/> : <Files setImage={setImage} /> }
                </div>
            </Modal>


        </>
    );
};


const Files = ({setImage}) => {

    const [activeType, setActiveType] = useState("Image")


    return (
        <div className={cls.files}>
            <h1>Upload {activeType}</h1>
            <div className={cls.header}>
                {
                    types.map(item => {
                        return <div
                            onClick={() => setActiveType(item)}
                            className={classNames(cls.header__item, {
                                [cls.active]: item === activeType
                            })}
                        >
                            {item}
                        </div>
                    })
                }
            </div>
            {
                activeType === "Image" ? <DropImage setImage={setImage}/> : <Gifs setImage={setImage}/>
            }
        </div>
    )
}




export default ImageModal;